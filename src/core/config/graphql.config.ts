import { ConfigService } from '@nestjs/config';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import * as process from 'node:process';
import { isDev } from '@/shared/utils/is-dev.util';


export const getGraphQLConfig = function(configService: ConfigService): ApolloDriverConfig {
	return {
		playground    : isDev(configService),
		path          : configService.getOrThrow<string>('GRAPHQL_PREFIX'),
		autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
		sortSchema    : true,
		context       : ({ req, res }) => ({ req, res }),
	};
};