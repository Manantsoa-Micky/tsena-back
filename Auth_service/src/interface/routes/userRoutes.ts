import { Router } from 'express';
import { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { UserController } from '../controllers/userController';

const router = Router();

const userController = new UserController();

router.get('/users', async (req: Request, res: Response) => await userController.getAll(req, res));
router.post('/users/register', async (req: Request, res: Response) => {
  await userController.create(req, res);
});
export { router as userRoutes };