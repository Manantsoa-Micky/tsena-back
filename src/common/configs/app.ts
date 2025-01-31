import express, { Express } from 'express';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';
import setupErrorHandler from './errorHandler';

export default (): Express => {
  const app = express();
  setupMiddlewares(app);
  setupRoutes(app);
  setupErrorHandler(app);
  return app;
};
