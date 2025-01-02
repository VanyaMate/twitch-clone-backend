import 'express-session';
import { SessionMetaData } from '@/shared/types/session-metadata.types';


declare module 'express-session' {
	interface SessionData {
		userId: string;
		createdAt: Date | string;
		metadata: SessionMetaData;
	}
}