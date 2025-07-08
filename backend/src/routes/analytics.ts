import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get overall analytics
router.get('/overview', analyticsController.getOverview);

// Get commodity analytics
router.get('/commodities', analyticsController.getCommodityAnalytics);

// Get daily volume data
router.get('/daily-volume', analyticsController.getDailyVolume);

// Get price history
router.get('/price-history/:commodity', analyticsController.getPriceHistory);

// Get P&L data
router.get('/pnl', analyticsController.getPnLData);

// Get risk metrics
router.get('/risk-metrics', analyticsController.getRiskMetrics);

export { router as analyticsRoutes }; 