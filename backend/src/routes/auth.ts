import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('role').optional().isIn(['admin', 'trader', 'analyst', 'viewer'])
];

// Routes
router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegister, authController.register);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getProfile);

export { router as authRoutes }; 