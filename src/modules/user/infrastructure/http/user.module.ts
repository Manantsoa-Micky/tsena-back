import { Express } from 'express';
import { Container } from '../../../../container';
import { UserController } from './controllers/user.controller';
import { config } from '../../../../common/configs/app.config';

export const setupUserModule = (app: Express, container: Container): void => {
  const userController = container.get<UserController>('userController');

  // User routes
  app.post(`${config.api.prefix}/users`, userController.createUser.bind(userController));
  app.get(`${config.api.prefix}/users`, userController.getUsers.bind(userController));
};