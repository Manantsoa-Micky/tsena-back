import express from 'express';
import dotenv from 'dotenv';
import { setupSwagger } from './common/swagger';
import errorHandler from './middleware/errorHandler';
import userRoutes from './modules/user/user.routes';
import { setupSecurityMiddleware } from './middleware/security.middleware';
import { setupLogging } from './middleware/logging.middleware';
import { config } from './common/configs/app.config';
import { logger } from './common/logger';

// Load environment variables
dotenv.config();

const app = express();

// Setup logging first to capture all requests
setupLogging(app);

// Security middleware
setupSecurityMiddleware(app);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(`${config.api.prefix}/user`, userRoutes);

// Swagger documentation
setupSwagger(app);

// Error handling middleware
app.use(errorHandler);

// Unhandled rejection handling
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Log application startup
logger.info(`Server starting in ${process.env.NODE_ENV} mode`);

export default app;
