// Third-party imports
import express from 'express';
import dotenv from 'dotenv';

// Application imports
import { setupSwagger } from './common/swagger';
import { setupUserModule } from '@user/infrastructure/http/user.module';
import {
  errorHandler,
  requestTimeout,
  setupLogging,
  setupSecurityMiddleware,
} from './middlewares';
import { logger } from './common/logger';
import { container } from './container';

// Load environment variables
dotenv.config();

const app = express();
let server: any;

// Setup logging first to capture all requests
setupLogging(app);

// Security middlewares
setupSecurityMiddleware(app);
app.use(requestTimeout({ timeout: 30000 }));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Setup modules with dependency injection
setupUserModule(app, container);

// Swagger documentation
setupSwagger(app);

// Error handling middlewares
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = () => {
  if (server) {
    logger.info('Received kill signal, shutting down gracefully');
    server.close(() => {
      logger.info('Closed out remaining connections');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error(
        'Could not close connections in time, forcefully shutting down',
      );
      process.exit(1);
    }, 10000);
  }
};

// Handle various shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Unhandled rejection handling
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  // Don't exit the process, but log the error
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  // Exit the process as uncaught exceptions are serious
  gracefulShutdown();
});

// Log application startup
logger.info(`Server starting in ${process.env.NODE_ENV} mode`);

// Export both app and server for testing purposes
export { app as default, server };
