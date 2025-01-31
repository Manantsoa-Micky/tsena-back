import { Request, Response } from 'express';
import { logger } from '@common/logger';
import { v4 as uuidv4 } from 'uuid';

export enum ErrorTypes {
  VALIDATION_ERROR = 'ValidationError',
  AUTHENTICATION_ERROR = 'AuthenticationError',
  AUTHORIZATION_ERROR = 'AuthorizationError',
  NOT_FOUND_ERROR = 'NotFoundError',
  CONFLICT_ERROR = 'ConflictError',
  INTERNAL_ERROR = 'InternalError',
}

const HTTP_STATUS_CODES = {
  [ErrorTypes.VALIDATION_ERROR]: 400,
  [ErrorTypes.AUTHENTICATION_ERROR]: 401,
  [ErrorTypes.AUTHORIZATION_ERROR]: 403,
  [ErrorTypes.NOT_FOUND_ERROR]: 404,
  [ErrorTypes.CONFLICT_ERROR]: 409,
  [ErrorTypes.INTERNAL_ERROR]: 500,
} as const;

export class APIError extends Error {
  public requestId: string;

  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public errors: any[] = [],
  ) {
    super(message);
    this.name = 'APIError';
    this.requestId = uuidv4();
  }
}

export default (err: Error | APIError, req: Request, res: Response) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const requestId = (err as APIError).requestId || uuidv4();
  const status =
    (err as APIError).status ||
    HTTP_STATUS_CODES[err.name as ErrorTypes] ||
    500;
  logger.error({
    requestId,
    name: err.name,
    message: err.message,
    stack: isDevelopment ? err.stack : undefined,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  const errorResponse = {
    status,
    success: false,
    message: err.message,
    requestId,
    errors: (err as APIError).errors || [],
    ...(!isDevelopment && { stack: err.stack }),
  };
  res.setHeader('X-Request-ID', requestId);

  return res.status(status).json(errorResponse);
};
