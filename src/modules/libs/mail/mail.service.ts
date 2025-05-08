import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import {
    VerificationTemplate,
} from '@/modules/libs/mail/templates/verification.template';


@Injectable()
export class MailService {
    public constructor (
        private readonly _mailerService: MailerService,
        private readonly _configService: ConfigService,
    ) {
    }

    public async sendVerificationToken (email: string, token: string) {
        const domain = this._configService.getOrThrow<string>('ALLOWED_ORIGIN');
        const html   = await render(VerificationTemplate({ domain, token }));
        return this._sendMail(email, 'Верификация аккаунта', html);
    }

    private _sendMail (email: string, subject: string, html: string) {
        return this._mailerService.sendMail({
            from: 'buhu653@gmail.com',
            to  : email,
            subject,
            html,
        });
    }
}
