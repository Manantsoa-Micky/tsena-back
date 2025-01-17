import { Server } from 'http';
import { connectDB } from './core/mongoConnection';
import { logger } from './common/logger';
import app from './app';

const PORT = process.env.PORT || 3000;
let server: Server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      logger.info(`⚡ Server running on port: ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to connect to the database', error);
    process.exit(1);
  }
};

startServer();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error(error.message);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
