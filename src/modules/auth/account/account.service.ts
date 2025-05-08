import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import {
    CreateUserInput,
} from '@/modules/auth/account/inputs/create-user.input';
import { hash } from 'argon2';
import {
    VerificationService,
} from '@/modules/auth/verification/verification.service';


@Injectable()
export class AccountService {
    public constructor (
        private readonly _prismaService: PrismaService,
        private readonly _verificationService: VerificationService,
    ) {
    }

    public async me (id: string) {
        try {
            return await this._prismaService.user.findUnique({
                where: { id },
            });
        } catch (e) {
            throw e;
        }
    }

    public async create (input: CreateUserInput) {
        const { password, username, email } = input;

        const createdUser = await this._prismaService.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email },
                ],
            },
        });

        if (createdUser) {
            if (createdUser.username === username) {
                throw new ConflictException(`Пользователь с таким логином уже существует`);
            }

            if (createdUser.email === email) {
                throw new ConflictException(`Пользователь с такой почтой уже существует`);
            }
        }

        const user = await this._prismaService.user.create({
            data: {
                username,
                email,
                password   : await hash(password),
                displayName: username,
            },
        });

        await this._verificationService.sendVerificationToken(user);

        return true;
    }
}
