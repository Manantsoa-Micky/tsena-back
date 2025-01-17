import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];

  res.status(status).json({
    status,
    message,
    errors,
  });
};

export default errorHandler;
