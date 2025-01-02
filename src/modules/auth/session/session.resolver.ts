import { Context, Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { UserModel } from '@/modules/auth/account/models/user.model';
import { GqlContext } from '@/shared/types/gql-context.types';
import { LoginInput } from '@/modules/auth/session/inputs/login.input';
import { UserAgent } from '@/shared/decorators/user-agent.decorator';
import { Authorization } from '@/shared/decorators/auth.decorator';
import { AuthorizedUserId } from '@/shared/decorators/authorized.decorator';
import { SessionId } from '@/shared/decorators/session-id.decorator';
import { SessionModel } from '@/modules/auth/session/models/session.model';


@Resolver('Session')
export class SessionResolver {
	constructor (private readonly _sessionService: SessionService) {
	}

	@Authorization()
	@Query(() => [ SessionModel ], { name: 'findSessionsByUserId' })
	public async findSessionsByUserId (
		@AuthorizedUserId() userId: string,
		@SessionId() sessionId: string,
	) {
		return this._sessionService.findSessionsByUserId(userId, sessionId);
	}

	@Authorization()
	@Query(() => SessionModel, { name: 'findCurrentSession' })
	public async findCurrentSession (
		@SessionId() sessionId: string,
	) {
		return this._sessionService.findCurrentSession(sessionId);
	}

	@Mutation(() => UserModel, { name: 'loginUser' })
	public async login (
		@Context() { req }: GqlContext,
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string,
	) {
		return this._sessionService.login(req, input, userAgent);
	}

	@Mutation(() => Boolean, { name: 'logoutUser' })
	public async logout (
		@Context() { req }: GqlContext,
	) {
		return this._sessionService.logout(req);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'clearSessionCookie' })
	public async clearSession (
		@Context() { req }: GqlContext,
	) {
		return this._sessionService.clearSession(req);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSessionCookie' })
	public async removeSession (
		@Context() { req }: GqlContext,
		@Args('id') sessionId: string,
	) {
		return this._sessionService.removeSession(req, sessionId);
	}
}
