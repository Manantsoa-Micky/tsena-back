import { NextFunction, Request, Response } from 'express';
import { logger } from '../common/logger';

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public errors: any[] = []
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Error types for better error classification
export enum ErrorTypes {
  VALIDATION_ERROR = 'ValidationError',
  AUTHENTICATION_ERROR = 'AuthenticationError',
  AUTHORIZATION_ERROR = 'AuthorizationError',
  NOT_FOUND_ERROR = 'NotFoundError',
  CONFLICT_ERROR = 'ConflictError',
  INTERNAL_ERROR = 'InternalError'
}

// Error handler middleware
export const errorHandler = (
  err: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log error details
  logger.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle known error types
  if (err instanceof APIError) {
    return res.status(err.status).json({
      status: err.status,
      code: err.code,
      message: err.message,
      errors: err.errors,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 400,
      code: ErrorTypes.VALIDATION_ERROR,
      message: 'Validation Error',
      errors: Object.values(err).map((e: any) => ({
        field: e.path,
        message: e.message,
      })),
      timestamp: new Date().toISOString(),
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    return res.status(409).json({
      status: 409,
      code: ErrorTypes.CONFLICT_ERROR,
      message: 'Duplicate key error',
      timestamp: new Date().toISOString(),
    });
  }

  // Default error response for unknown errors
  const defaultError = {
    status: 500,
    code: ErrorTypes.INTERNAL_ERROR,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(defaultError);
};

// Helper function to create API errors
export const createAPIError = (
  status: number,
  message: string,
  code?: string,
  errors?: any[]
): APIError => {
  return new APIError(status, message, code, errors);
};
