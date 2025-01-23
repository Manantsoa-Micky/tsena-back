import morgan from 'morgan';
import { Express, NextFunction, Request, Response } from 'express';
import { logger } from '../common/logger';
import { v4 as uuidv4 } from 'uuid';

interface RequestWithId extends Request {
  id?: string;
  startTime?: number;
}

export const setupLogging = (app: Express): void => {
  // Add request ID and timing
  app.use((req: RequestWithId, res: Response, next: NextFunction) => {
    req.id = uuidv4();
    req.startTime = Date.now();

    // Add response logging on finish
    res.on('finish', () => {
      const duration = Date.now() - (req.startTime || 0);
      const logData = {
        requestId: req.id,
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('user-agent'),
        ip: req.ip,
      };

      if (res.statusCode >= 400) {
        logger.error('Request failed', logData);
      } else {
        logger.info('Request completed', logData);
      }
    });

    next();
  });

  // Custom morgan format
  morgan.token('request-id', (req: RequestWithId) => req.id || '-');
  morgan.token('response-time-ms', (req: RequestWithId) => {
    const duration = Date.now() - (req.startTime || 0);
    return `${duration}ms`;
  });

  const morganFormat =
    process.env.NODE_ENV === 'development'
      ? ':request-id :method :url :status :response-time-ms'
      : ':request-id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time-ms ":referrer" ":user-agent"';

  // Use morgan with Winston logger
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message: string) => {
          logger.info(message.trim());
        },
      },
      skip: (req: Request) => {
        return process.env.NODE_ENV === 'production' && req.url === '/health';
      },
    }),
  );

  logger.info('Logging middleware configured successfully');
};
