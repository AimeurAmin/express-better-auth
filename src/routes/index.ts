import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
router.use('/me', authRoutes);
router.use('/users', userRoutes);

export default router;