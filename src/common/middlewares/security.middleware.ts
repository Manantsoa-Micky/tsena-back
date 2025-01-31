import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Express, NextFunction, Request, Response } from 'express';
import { config } from '@common/constants/app.config';
import { logger } from '@common/logger';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';

// Security configuration interface
interface SecurityConfig {
  corsOptions?: cors.CorsOptions;
  rateLimitMax?: number;
  rateLimitWindowMs?: number;
  trustProxy?: boolean;
}

export const setupSecurityMiddleware = (
  app: Express,
  options: SecurityConfig = {},
): void => {
  // Trust proxy if behind a reverse proxy
  if (options.trustProxy) {
    app.set('trust proxy', 1);
  }

  // Enhanced Helmet configuration
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );

  // CORS with enhanced options
  const corsOptions: cors.CorsOptions = {
    ...config.cors,
    ...options.corsOptions,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  };
  app.use(cors(corsOptions));

  // Enhanced rate limiting
  const limiter = rateLimit({
    windowMs: options.rateLimitWindowMs || config.rateLimit.windowMs,
    max: options.rateLimitMax || config.rateLimit.max,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        status: 429,
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
        timestamp: new Date().toISOString(),
      });
    },
  });
  app.use(limiter);

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // MongoDB query sanitization
  app.use(mongoSanitize());

  // Security headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=()',
    );
    next();
  });
  app.disable('x-powered-by');

  logger.info('Security middleware configured successfully');
};
