import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRegistration, validateLogin } from '../middlewares/validation';
import { authenticateUser } from '../middlewares/auth';

const router = Router();
const authController = new AuthController();

// Additional user session endpoints
router.get('/', authenticateUser, authController.me);
router.get('/session', authenticateUser, authController.getSession);

export default router;