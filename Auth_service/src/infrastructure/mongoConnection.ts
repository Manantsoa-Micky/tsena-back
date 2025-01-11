import mongoose from 'mongoose';
import config from './config/config';
import { logger } from './logger';

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