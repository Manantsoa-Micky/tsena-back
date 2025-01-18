import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Express } from 'express';
import { config } from '../config/app.config';

export const setupSecurityMiddleware = (app: Express): void => {
	// Basic security headers
	app.use(helmet());
	
	// CORS configuration
	app.use(cors(config.cors));
	
	// Rate limiting
	app.use(rateLimit(config.rateLimit));
	
	// Disable x-powered-by header
	app.disable('x-powered-by');
};