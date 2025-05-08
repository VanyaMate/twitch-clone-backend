import {
    BadRequestException,
    ConflictException,
    Injectable, InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { LoginInput } from '@/modules/auth/session/inputs/login.input';
import { verify } from 'argon2';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { getSessionMetaData } from '@/shared/utils/session-metadata.util';
import { RedisService } from '@/core/redis/redis.service';
import { SessionModel } from '@/modules/auth/session/models/session.model';
import { destroySession, saveSession } from '@/shared/utils/session.util';
import {
    VerificationService,
} from '@/modules/auth/verification/verification.service';


@Injectable()
export class SessionService {
    public constructor (
        private readonly _prismaService: PrismaService,
        private readonly _redisService: RedisService,
        private readonly _configService: ConfigService,
        private readonly _verificationService: VerificationService,
    ) {
    }

    public async findSessionsByUserId (userId: string, currentSessionId?: string) {
        const keys                              = await this._redisService.keys('*');
        const userSessions: Array<SessionModel> = [];

        let key;
        let sessionData;
        let session;
        for (key of keys) {
            sessionData = await this._redisService.get(key);
            if (sessionData) {
                session = JSON.parse(sessionData);
                if (session.userId === userId) {
                    userSessions.push({
                        ...session,
                        id: key.split(':')[1],
                    });
                }
            }
        }

        if (currentSessionId) {
            return userSessions.filter((session) => session.id !== currentSessionId);
        }

        return userSessions;
    }

    public async findCurrentSession (sessionId: string) {
        const sessionData = await this._redisService.get(
            this._getSessionKeyBySessionId(sessionId),
        );

        return {
            ...JSON.parse(sessionData),
            id: sessionId,
        };
    }

    public async removeSession (request: Request, sessionId: string) {
        if (sessionId === request.session.id) {
            throw new ConflictException(`Текущую сессию удалить нельзя`);
        }

        await this._redisService.del(
            this._getSessionKeyBySessionId(sessionId),
        );

        return true;
    }

    public async clearSession (request: Request) {
        return destroySession(request, this._configService);
    }

    public async login (request: Request, input: LoginInput, userAgent: string) {
        const { login, password } = input;

        const user = await this._prismaService.user.findFirst({
            where: {
                OR: [
                    { email: login },
                    { username: login },
                ],
            },
        });

        if (!user) {
            throw new NotFoundException(`Пользователь не найден`);
        }

        const isValidPassword = await verify(user.password, password);

        if (!isValidPassword) {
            throw new UnauthorizedException(`Неверный пароль`);
        }

        if (!user.isEmailVerified) {
            await this._verificationService.sendVerificationToken(user);
            throw new BadRequestException('Аккаунт не верифицирован.' +
                ' Проверьте почту');
        }

        const metadata = getSessionMetaData(request, userAgent);
        return saveSession(request, user, metadata);
    }

    public async logout (request: Request) {
        return new Promise((resolve, reject) => {
            request.session.destroy((err) => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(`Не удалось завершить сессию`),
                    );
                }

                destroySession(request, this._configService)
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    private _getSessionKeyBySessionId (sessionId: string) {
        return `${ this._configService.getOrThrow<string>('SESSION_FOLDER') }${ sessionId }`;
    }
}
