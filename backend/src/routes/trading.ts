import { Router } from 'express';
import { tradingController } from '../controllers/tradingController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all trades (with pagination and filters)
router.get('/', tradingController.getTrades);

// Get trade by ID
router.get('/:id', tradingController.getTradeById);

// Create new trade (requires trader or admin role)
router.post('/', requireRole(['trader', 'admin']), tradingController.createTrade);

// Update trade (requires trader or admin role)
router.put('/:id', requireRole(['trader', 'admin']), tradingController.updateTrade);

// Delete trade (requires admin role)
router.delete('/:id', requireRole(['admin']), tradingController.deleteTrade);

// Get trades by commodity
router.get('/commodity/:commodity', tradingController.getTradesByCommodity);

// Get trades by status
router.get('/status/:status', tradingController.getTradesByStatus);

export { router as tradingRoutes }; 