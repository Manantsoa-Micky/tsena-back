import { NextFunction, Request, Response, Router } from 'express';
import UserController from '../controllers/user.controller';
import { routesV1 } from '@common/constants/app.routes';

export default (router: Router): void => {
  router.get(
    `${routesV1.auth.register}`,
    (req: Request, res: Response, next: NextFunction) => {
      const userController = new UserController();
      userController.getUsers(req, res, next);
    },
  );
};
