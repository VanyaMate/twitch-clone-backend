import { PrismaService } from '@/core/prisma/prisma.service';
import { TokenType, type User } from '@/prisma/generated';
import { v4 } from 'uuid';


export const generateToken = async function (prismaService: PrismaService, user: User, tokenType: TokenType, isUUID: boolean = false) {
    let token: string;

    if (isUUID) {
        token = v4();
    } else {
        // Генерация 6-и значного числа от 100_000 до 1_000_000
        token = Math.floor(
            Math.random() * (1_000_000 - 100_000) + 100_000,
        ).toString();
    }

    const expiresIn     = new Date(new Date().getTime() + 300_000); // 5m
    const existingToken = await prismaService.token.findFirst({
        where: {
            type: tokenType,
            user: {
                id: user.id,
            },
        },
    });
    if (existingToken) {
        await prismaService.token.delete({ where: { id: existingToken.id } });
    }

    const newToken = await prismaService.token.create({
        data   : {
            token,
            expiresIn,
            type: tokenType,
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
        include: {
            user: true,
        },
    });

    return newToken;
};