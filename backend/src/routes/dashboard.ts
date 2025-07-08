import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get dashboard metrics
router.get('/metrics', dashboardController.getMetrics);

// Get recent trades
router.get('/recent-trades', dashboardController.getRecentTrades);

// Get market overview
router.get('/market-overview', dashboardController.getMarketOverview);

// Get alerts
router.get('/alerts', dashboardController.getAlerts);

export { router as dashboardRoutes }; 