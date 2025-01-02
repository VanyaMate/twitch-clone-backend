import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailerConfig } from '@/core/config/mailer.config';


@Global()
@Module({
	providers: [ MailService ],
	imports  : [
		MailerModule.forRootAsync({
			imports   : [ ConfigModule ],
			inject    : [ ConfigService ],
			useFactory: getMailerConfig,
		}),
	],
	exports  : [
		MailService,
	],
})
export class MailModule {
}
