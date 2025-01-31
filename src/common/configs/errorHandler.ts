import { Express, NextFunction, Request, Response } from 'express';
import errorHandler from '@common/middlewares/errorHandler';

export default (app: Express): void => {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res);
  });
};
