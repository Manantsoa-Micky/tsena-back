import { Router } from 'express';
import UserController from '../controllers/user.controller';
import validationMiddleware from '../../../../../middlewares/validationMiddleware';
import { CreateUserDto } from '../dtos/CreateUserdto';

const router = Router();
const userController = new UserController();

router.post(
  '/register',
  validationMiddleware(CreateUserDto),
  (req, res, next) => userController.createUser(req, res, next),
);
router.get('/get-all', userController.getUsers);

export default router;
