import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'http';
import { userRoutes } from './interface/routes/userRoutes';
import { errorHandler } from './interface/middleware/errorHandler';
import { setupSwagger } from './interface/swagger';
import { logger } from './infrastructure/logger';
import { connectDB } from './infrastructure/mongoConnection';
import { rabbitMQService } from './infrastructure/rabbitMQ/rabbitMQService';
import { Schema } from 'mongoose';

dotenv.config();
const app = express();
let server: Server;
 
app.use(express.json());
app.use('/api', userRoutes);
app.use(errorHandler);
setupSwagger(app);

const PORT = process.env.PORT || 3000;

connectDB().then();
server = app.listen(PORT, () => {
  logger.info(`⚡ Server running on port: ${PORT}`);
});

const initializeRabbitMQServices = async () => {
  try {
    await rabbitMQService.init();
    logger.info('RabbitMQ client initialized and listening for messages');
  } catch (e) {
    logger.info('Failed to initialize RabbitMQ services: ', e);
  }
};

initializeRabbitMQServices().then();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Sever closed');
      process.exit(0);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

