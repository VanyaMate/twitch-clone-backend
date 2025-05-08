import { Request } from 'express';
import { User } from '@/prisma/generated';
import { SessionMetaData } from '@/shared/types/session-metadata.types';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


export const saveSession = async function (request: Request, user: User, metadata: SessionMetaData) {
    return new Promise((resolve, reject) => {
        request.session.userId    = user.id;
        request.session.createdAt = new Date();
        request.session.metadata  = metadata;

        request.session.save((err) => {
            if (err) {
                return reject(
                    new InternalServerErrorException(`Не удалось сохранить сессию`),
                );
            }

            resolve(user);
        });
    });
};

export const destroySession = async function (request: Request, configService: ConfigService): Promise<void> {
    return new Promise((resolve, reject) => {
        request.session.destroy((err) => {
            if (err) {
                return reject(
                    new InternalServerErrorException(`Не удалось завершить сессию`),
                );
            }

            request.res.clearCookie(
                configService.getOrThrow<string>(`SESSION_NAME`),
            );
            resolve();
        });
    });
};