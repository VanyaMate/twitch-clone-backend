import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { MailModule } from '@/modules/libs/mail/mail.module';


@Module({
    providers: [ VerificationResolver, VerificationService ],
    exports  : [ VerificationService ],
})
export class VerificationModule {
}
