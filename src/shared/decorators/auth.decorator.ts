import { applyDecorators, UseGuards } from '@nestjs/common';
import { GQLAuthGuard } from '@/shared/guards/gql-auth.guard';


export const Authorization = function() {
	return applyDecorators(UseGuards(GQLAuthGuard));
};