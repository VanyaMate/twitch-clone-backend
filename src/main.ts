import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core/core.module';
import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { parseBoolean } from '@/shared/utils/parse-boolean.util';
import { RedisService } from '@/core/redis/redis.service';
import { parse } from '@/shared/utils/ms.util';


async function bootstrap () {
	const app    = await NestFactory.create(CoreModule);
	const config = app.get(ConfigService);
	const redis  = app.get(RedisService);

	app.use(
		cookieParser(config.getOrThrow<string>('COOKIES_SECRET')),
	);
	app.use(
		session({
			secret           : config.getOrThrow<string>('SESSION_SECRET'),
			name             : config.getOrThrow<string>('SESSION_NAME'),
			resave           : false,
			saveUninitialized: false,
			cookie           : {
				domain  : config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge  : parse(config.getOrThrow<string>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
				secure  : parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
				sameSite: 'lax',
			},
			store            : new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER'),
			}),
		}),
	);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);

	app.enableCors({
		origin        : config.getOrThrow<string>('ALLOWED_ORIGIN').split(','),
		credentials   : true,
		exposedHeaders: [ 'Set-Cookie' ],
	});

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}

bootstrap();
