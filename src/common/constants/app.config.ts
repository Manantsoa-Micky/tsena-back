import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    requestTimeout: 30000,
    gracefulShutdownTimeout: 10000,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  api: {
    prefix: '/api',
  },
} as const;
