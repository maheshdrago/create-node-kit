import { Router, Request, Response } from 'express';
import userRoutes from './userRoutes';

const router = Router();

router.use('/users', userRoutes);

router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to the API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      health: '/health',
    },
  });
});

export default router;