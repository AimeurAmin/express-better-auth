import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateUser } from '../middlewares/auth';

const router = Router();
const userController = new UserController();

router.get('/profile', authenticateUser, userController.getProfile);
router.put('/profile', authenticateUser, userController.updateProfile);

export default router;