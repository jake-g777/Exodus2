import { Router } from 'express';
import { TradeTieOutController } from '../controllers/tradeTieOutController';

const router = Router();

// Create a new trade tie-out session with results
router.post('/trade-tieouts', TradeTieOutController.createTradeTieOut);

// Get all trade tie-outs with summary statistics
router.get('/trade-tieouts', TradeTieOutController.getTradeTieOuts);

// Get trade details for a specific date
router.get('/trade-tieouts/:tradeDate/details', TradeTieOutController.getTradeDetails);

export default router; 