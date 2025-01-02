import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';


export const AuthorizedUserId = createParamDecorator(
	(customUserId: string | undefined = undefined, ctx: ExecutionContext) => {
		if (customUserId !== undefined) {
			return customUserId;
		}

		if (ctx.getType() === 'http') {
			return ctx.switchToHttp().getRequest().session.userId;
		} else {
			return GqlExecutionContext.create(ctx).getContext().req.session.userId;
		}
	},
);