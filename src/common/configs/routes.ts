import { Express, Router } from 'express';
import userRoutes from '@user/infrastructure/http/routes/user.routes';
import authenticationRoutes from '@auth/infrastructure/http/routes/auth.routes';
import { config } from '@common/constants/app.config';

export default (app: Express): void => {
  const router = Router();
  app.use(`${config.api.prefix}`, router);
  authenticationRoutes(router);
  userRoutes(router);
};
