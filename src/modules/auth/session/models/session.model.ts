import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
	DeviceInfo,
	LocationInfo, SessionMetaData,
} from '@/shared/types/session-metadata.types';


@ObjectType()
export class LocationModel implements LocationInfo {
	@Field(() => String)
	country: string;

	@Field(() => String)
	city: string;

	@Field(() => Number)
	latitude: number;

	@Field(() => Number)
	longitude: number;
}

@ObjectType()
export class DeviceModel implements DeviceInfo {
	@Field(() => String)
	os: string;

	@Field(() => String)
	browser: string;

	@Field(() => String)
	type: string;
}

@ObjectType()
export class SessionMetadataModel implements SessionMetaData {
	@Field(() => String)
	ip: string;

	@Field(() => LocationModel)
	location: LocationModel;

	@Field(() => DeviceModel)
	device: DeviceModel;
}

@ObjectType()
export class SessionModel {
	@Field(() => ID)
	id: string;

	@Field(() => String)
	userId: string;

	@Field(() => String)
	createdAt: string;

	@Field(() => SessionMetadataModel)
	metadata: SessionMetadataModel;
}