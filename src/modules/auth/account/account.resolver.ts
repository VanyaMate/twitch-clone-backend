import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { UserModel } from '@/modules/auth/account/models/user.model';
import {
    CreateUserInput,
} from '@/modules/auth/account/inputs/create-user.input';
import { AuthorizedUserId } from '@/shared/decorators/authorized.decorator';
import { Authorization } from '@/shared/decorators/auth.decorator';


@Resolver('Account')
export class AccountResolver {
    constructor (private readonly _accountService: AccountService) {
    }

    @Authorization()
    @Query(() => UserModel, { name: 'findProfileById' })
    public async me (@AuthorizedUserId() userId: string) {
        return this._accountService.me(userId);
    }

    @Mutation(() => Boolean, { name: 'createUser' })
    public async create (@Args('data') input: CreateUserInput) {
        return this._accountService.create(input);
    }
}
