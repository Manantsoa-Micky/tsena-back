import { NextFunction, Request, Response, Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { CommandBus } from '@_shared/cqrs/command-bus';
import { validationMiddleware } from '@common/middlewares/validationMiddleware';
import { routesV1 } from '@common/constants/app.routes';

export default (router: Router): void => {
  router.post(
    `${routesV1.auth.register}`,
    validationMiddleware(RegisterUserDto),
    (req: Request, res: Response, next: NextFunction) => {
      const authController = new AuthController(CommandBus.getInstance());
      authController.registerUser(req, res, next);
    },
  );
};
