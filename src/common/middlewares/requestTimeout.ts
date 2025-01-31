import { NextFunction, Request, Response, Express } from 'express';
import { logger } from '@common/logger';
import { config } from '@common/constants/app.config';

export const setupRequestTimeout = (app: Express): void => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const timeout = config.server.requestTimeout;
    const message = 'Request Timeout';

    // Store original response methods
    const originalJson = res.json;
    const originalSend = res.send;
    let isResponseSent = false;

    // Create timeout handler
    const timeoutHandler = () => {
      if (!isResponseSent) {
        isResponseSent = true;
        logger.warn(
          `Request timeout after ${timeout}ms: ${req.method} ${req.url}`,
        );

        res.status(408).json({
          status: 408,
          code: 'REQUEST_TIMEOUT',
          message,
          timestamp: new Date().toISOString(),
          details: {
            path: req.path,
            method: req.method,
            timeout: `${timeout}ms`,
          },
        });
      }
    };

    // Set timeout
    const timeoutId = setTimeout(timeoutHandler, timeout);

    // Override response methods to clear timeout
    res.json = function (body): Response {
      clearTimeout(timeoutId);
      isResponseSent = true;
      return originalJson.call(this, body);
    };

    res.send = function (body): Response {
      clearTimeout(timeoutId);
      isResponseSent = true;
      return originalSend.call(this, body);
    };

    // Clear timeout on response finish
    res.on('finish', () => {
      clearTimeout(timeoutId);
    });

    next();
  });
};
