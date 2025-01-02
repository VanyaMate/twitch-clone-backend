import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class MailService {
	public constructor (
		private readonly _mailerService: MailerService,
		private readonly _configService: ConfigService,
	) {
	}

	private _sendMail (email: string, subject: string, html: string) {
		return this._mailerService.sendMail({
			to: email,
			subject,
			html,
		});
	}
}
