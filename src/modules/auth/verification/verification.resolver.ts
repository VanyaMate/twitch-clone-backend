import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { VerificationService } from './verification.service';
import { GqlContext } from '@/shared/types/gql-context.types';
import {
    VerificationInput,
} from '@/modules/auth/verification/inputs/verification.input';
import { UserAgent } from '@/shared/decorators/user-agent.decorator';
import { UserModel } from '@/modules/auth/account/models/user.model';


@Resolver('Verification')
export class VerificationResolver {
    constructor (private readonly verificationService: VerificationService) {
    }

    @Mutation(() => UserModel, { name: 'verifyAccount' })
    public async verify (
        @Context() { req }: GqlContext,
        @Args('data') input: VerificationInput,
        @UserAgent() userAgent: string,
    ) {
        return this.verificationService.verify(req, input, userAgent);
    }
}
