import mongoose from 'mongoose';
import { logger } from '../common/logger';
import { config } from '../common/configs/app.config';

export const connectDB = async () => {
  const URI = config.server.mongoURI;
  try {
    logger.info('Connecting to database...');
    await mongoose.connect(URI);
    logger.info('⚡ Connected to database');
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};
