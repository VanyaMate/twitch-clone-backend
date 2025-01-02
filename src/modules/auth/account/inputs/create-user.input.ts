import { Field, InputType } from '@nestjs/graphql';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength,
} from 'class-validator';


@InputType()
export class CreateUserInput {
	@Field()
	@IsNotEmpty()
	@IsString()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	username: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	password: string;
}