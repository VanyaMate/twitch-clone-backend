import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { MailService } from '@/modules/libs/mail/mail.service';
import { PrismaService } from '@/core/prisma/prisma.service';
import {
    VerificationInput,
} from '@/modules/auth/verification/inputs/verification.input';
import type { Request } from 'express';
import { TokenType, User } from '@/prisma/generated';
import { getSessionMetaData } from '@/shared/utils/session-metadata.util';
import { saveSession } from '@/shared/utils/session.util';
import { generateToken } from '@/shared/utils/generate-token.util';


@Injectable()
export class VerificationService {
    public constructor (
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
    ) {
    }

    public async verify (request: Request, input: VerificationInput, userAgent: string) {
        const { token }     = input;
        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.EMAIL_VERIFY,
            },
        });

        if (!existingToken) {
            throw new NotFoundException('No token found');
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date();

        if (hasExpired) {
            throw new BadRequestException('Token expired');
        }

        const user = await this.prismaService.user.update({
            where: {
                id: existingToken.userId,
            },
            data : {
                isEmailVerified: true,
            },
        });

        await this.prismaService.token.delete({ where: { id: existingToken.id } });
        const metadata = getSessionMetaData(request, userAgent);
        return saveSession(request, user, metadata);
    }

    public async sendVerificationToken (user: User) {
        const verificationToken = await generateToken(
            this.prismaService,
            user,
            TokenType.EMAIL_VERIFY,
            true,
        );

        await this.mailService.sendVerificationToken(user.email, verificationToken.token);

        return true;
    }
}
