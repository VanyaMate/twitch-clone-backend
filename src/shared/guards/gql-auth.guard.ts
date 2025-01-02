import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { GqlExecutionContext } from '@nestjs/graphql';


@Injectable()
export class GQLAuthGuard implements CanActivate {
	public constructor (private readonly _prismaService: PrismaService) {
	}

	async canActivate (context: ExecutionContext): Promise<boolean> {
		if (
			typeof GqlExecutionContext
				.create(context)
				.getContext()
				.req.session?.userId === 'undefined'
		) {
			throw new UnauthorizedException(`Пользователь не авторизован`);
		}

		return true;
	}
}