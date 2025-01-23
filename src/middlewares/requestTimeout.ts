import { Request, Response, NextFunction } from 'express';
import { logger } from '../common/logger';
import { createAPIError } from './errorHandler';

export interface TimeoutOptions {
  timeout?: number;
  message?: string;
}

export const requestTimeout = (options: TimeoutOptions = {}) => {
  const {
    timeout = 30000,
    message = 'Request Timeout'
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Store original response methods
    const originalJson = res.json;
    const originalSend = res.send;
    let isResponseSent = false;

    // Create timeout handler
    const timeoutHandler = () => {
      if (!isResponseSent) {
        isResponseSent = true;
        logger.warn(`Request timeout after ${timeout}ms: ${req.method} ${req.url}`);
        
        const error = createAPIError(
          408,
          message,
          'REQUEST_TIMEOUT',
          [{
            path: req.path,
            method: req.method,
            timeout: `${timeout}ms`
          }]
        );
        
        res.status(408).json({
          status: 408,
          code: 'REQUEST_TIMEOUT',
          message,
          timestamp: new Date().toISOString(),
          details: {
            path: req.path,
            method: req.method,
            timeout: `${timeout}ms`
          }
        });
      }
    };

    // Set timeout
    const timeoutId = setTimeout(timeoutHandler, timeout);

    // Override response methods to clear timeout
    res.json = function(body): Response {
      clearTimeout(timeoutId);
      isResponseSent = true;
      return originalJson.call(this, body);
    };

    res.send = function(body): Response {
      clearTimeout(timeoutId);
      isResponseSent = true;
      return originalSend.call(this, body);
    };

    // Clear timeout on response finish
    res.on('finish', () => {
      clearTimeout(timeoutId);
    });

    next();
  };
};
