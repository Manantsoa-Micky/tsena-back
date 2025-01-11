import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'http';
import { setupSwagger } from './common/swagger';
import { errorHandler } from './common/errorHandler';
import { connectDB } from './common/mongoConnection';
import { logger } from './common/logger';
import { userRoutes } from './modules/user/user.routes';

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

