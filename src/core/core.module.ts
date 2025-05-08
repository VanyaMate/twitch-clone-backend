import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { RedisModule } from './redis/redis.module';
import { getGraphQLConfig } from '@/core/config/graphql.config';
import { IS_DEV_ENV } from '@/shared/utils/is-dev.util';
import { AccountModule } from '@/modules/auth/account/account.module';
import { SessionModule } from '@/modules/auth/session/session.module';
import {
    VerificationModule,
} from '@/modules/auth/verification/verification.module';
import { MailModule } from '@/modules/libs/mail/mail.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
            isGlobal     : true,
        }),
        GraphQLModule.forRootAsync({
            driver    : ApolloDriver,
            useFactory: getGraphQLConfig,
            imports   : [ ConfigModule ],
            inject    : [ ConfigService ],
        }),
        PrismaModule,
        RedisModule,
        AccountModule,
        SessionModule,
        MailModule,
        VerificationModule,
    ],
})
export class CoreModule {
}
