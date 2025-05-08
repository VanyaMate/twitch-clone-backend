import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { config } from 'rxjs';


export const getMailerConfig = function (configService: ConfigService): MailerOptions {
    return {
        transport: {
            host    : configService.getOrThrow<string>('MAIL_HOST'),
            port    : configService.getOrThrow<string>('MAIL_PORT'),
            secure  : false,
            auth    : {
                user: configService.getOrThrow<string>('MAIL_LOGIN'),
                pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
            },
            defaults: {
                from: `"TwitchClone" ${ configService.getOrThrow<string>('MAIL_LOGIN') }`,
            },
        },
    };
};