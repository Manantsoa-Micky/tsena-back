import { Server } from 'http';
import { connectDB, closeDBConnection } from './mongoConnection';
import { logger } from './common/logger';
import app from './app';
import { config } from './common/configs/app.config';

const PORT = config.server.port;
let server: Server;
let shutdownInProgress = false;

const startServer = async (retryCount = 0, maxRetries = 5) => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      logger.info(`⚡ Server running on port: ${PORT}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
        process.exit(1);
      }
      logger.error('Server error:', error);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    
    if (retryCount < maxRetries) {
      const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
      logger.info(`Retrying in ${backoffTime/1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      return startServer(retryCount + 1, maxRetries);
    }
    
    logger.error('Max retry attempts reached. Exiting...');
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string) => {
  if (shutdownInProgress) return;
  shutdownInProgress = true;

  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    const shutdownPromises: Promise<void>[] = [];

    if (server) {
      shutdownPromises.push(
        new Promise<void>((resolve, reject) => {
          server.close((err) => {
            if (err) reject(err);
            else resolve();
          });
        })
      );
    }

    shutdownPromises.push(closeDBConnection());

    await Promise.race([
      Promise.all(shutdownPromises),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Shutdown timeout')), 10000)
      )
    ]);

    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log but don't exit for unhandled rejections
});

startServer().catch((error) => {
  logger.error('Failed to start application:', error);
  process.exit(1);
});
