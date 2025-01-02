export type LocationInfo = {
	country: string;
	city: string;
	latitude: number;
	longitude: number;
}

export type DeviceInfo = {
	browser: string;
	os: string;
	type: string;
}

export type SessionMetaData = {
	location: LocationInfo;
	device: DeviceInfo;
	ip: string;
}