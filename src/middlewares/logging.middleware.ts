import morgan from 'morgan';
import { Express } from 'express';
import { logger } from '../common/logger';

export const setupLogging = (app: Express): void => {
	// Create custom morgan format
	const morganFormat = process.env.NODE_ENV === 'development' 
		? 'dev' 
		: ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

	// Use morgan with Winston logger
	app.use(morgan(morganFormat, {
		stream: {
			write: (message: string) => {
				logger.info(message.trim());
			}
		}
	}));
};
