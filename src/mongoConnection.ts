import mongoose from 'mongoose';
import { logger } from './common/logger';
import { config } from './common/configs/app.config';

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 50,
};

export const connectDB = async () => {
  const URI = config.server.mongoURI;
  
  try {
    logger.info('Connecting to database...');
    
    mongoose.connection.on('connected', () => {
      logger.info('⚡ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        logger.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

    await mongoose.connect(URI, mongooseOptions);
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    // Don't exit immediately, allow for retry logic in server.ts
    throw error;
  }
};

export const closeDBConnection = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    throw error;
  }
};
