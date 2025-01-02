import { Request } from 'express';
import { SessionMetaData } from '@/shared/types/session-metadata.types';
import { IS_DEV_ENV } from '@/shared/utils/is-dev.util';
import { lookup } from 'geoip-lite';
import * as coutries from 'i18n-iso-countries';


const DeviceDetector = require('device-detector-js');

coutries.registerLocale(require('i18n-iso-countries/langs/en.json'));


export const getSessionMetaData = function(request: Request, userAgent: string): SessionMetaData {
	let ip: string = '83.220.236.105'; // IP Москвы

	if (!IS_DEV_ENV) {
		if (Array.isArray(request.headers['cf-connecting-ip'])) {
			ip = request.headers['cf-connecting-ip'][0];
		} else {
			if (request.headers['cf-connecting-ip']) {
				ip = request.headers['cf-connecting-ip'];
			} else if (typeof request.headers['x-forwarded-for'] === 'string') {
				ip = request.headers['x-forwarded-for'].split(',')[0];
			} else {
				ip = request.ip;
			}
		}
	}

	const device   = new DeviceDetector().parse(userAgent);
	const location = lookup(ip);

	return {
		location: {
			country  : coutries.getName(location.country, 'en') || 'Unknown',
			city     : location.city,
			latitude : location.ll[0] ?? 0,
			longitude: location.ll[1] ?? 0,
		},
		device  : {
			browser: device.client.name,
			os     : device.os.name,
			type   : device.device.type,
		},
		ip,
	};
};