import mongoose from 'mongoose';
import { logger } from './logger';
import config from './config';

export const connectDB = async () => {
  try {
    logger.info('Connecting to database...');
    await mongoose.connect(config.MONGO_URI!);
    logger.info('⚡Connected to database');
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};