import { setupSwagger } from '@common/swagger';
import express, { Express } from 'express';
import {
  setupLogging,
  setupRequestTimeout,
  setupSecurityMiddleware,
} from '@common/middlewares';

export default (app: Express) => {
  setupLogging(app);
  setupSecurityMiddleware(app);
  setupRequestTimeout(app);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupSwagger(app);
};
