import { Request, Response } from 'express';
import { logger } from '../utils/logger';

class DashboardController {
  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const metrics = {
        totalTrades: 1234,
        totalVolume: 45600000,
        totalValue: 2340000000,
        dailyPnL: 230000,
        monthlyPnL: 2300000,
        openPositions: 89,
        riskMetrics: {
          var95: 1250000,
          maxDrawdown: 850000,
          sharpeRatio: 1.85,
          volatility: 0.23
        }
      };

      res.json({ success: true, data: metrics });
    } catch (error) {
      logger.error('Get dashboard metrics error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async getRecentTrades(req: Request, res: Response): Promise<void> {
    try {
      const recentTrades = [
        {
          id: '1',
          tradeId: 'TRADE-001',
          commodity: 'crude_oil',
          side: 'buy',
          quantity: 1000,
          price: 85.50,
          currency: 'USD',
          tradeDate: '2024-01-05T10:30:00Z',
          settlementDate: '2024-01-07T10:30:00Z',
          counterparty: 'Shell Trading',
          status: 'confirmed',
          createdAt: '2024-01-05T10:30:00Z'
        },
        {
          id: '2',
          tradeId: 'TRADE-002',
          commodity: 'natural_gas',
          side: 'sell',
          quantity: 500,
          price: 78.20,
          currency: 'USD',
          tradeDate: '2024-01-05T09:15:00Z',
          settlementDate: '2024-01-06T09:15:00Z',
          counterparty: 'BP Energy',
          status: 'settled',
          createdAt: '2024-01-05T09:15:00Z'
        },
        {
          id: '3',
          tradeId: 'TRADE-003',
          commodity: 'electricity',
          side: 'buy',
          quantity: 2000,
          price: 65.80,
          currency: 'USD',
          tradeDate: '2024-01-05T08:45:00Z',
          settlementDate: '2024-01-08T08:45:00Z',
          counterparty: 'ExxonMobil',
          status: 'pending',
          createdAt: '2024-01-05T08:45:00Z'
        }
      ];

      res.json({ success: true, data: recentTrades });
    } catch (error) {
      logger.error('Get recent trades error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async getMarketOverview(req: Request, res: Response): Promise<void> {
    try {
      const marketOverview = {
        commodities: [
          { name: 'Crude Oil', price: 85.50, change: 2.3, volume: 25000000 },
          { name: 'Natural Gas', price: 78.20, change: -1.5, volume: 12000000 },
          { name: 'Electricity', price: 65.80, change: 0.8, volume: 8600000 },
          { name: 'Coal', price: 45.60, change: -0.3, volume: 3200000 },
          { name: 'Renewables', price: 89.20, change: 1.2, volume: 2800000 }
        ],
        marketSentiment: 'bullish',
        volatilityIndex: 0.23
      };

      res.json({ success: true, data: marketOverview });
    } catch (error) {
      logger.error('Get market overview error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async getAlerts(req: Request, res: Response): Promise<void> {
    try {
      const alerts = [
        {
          id: '1',
          type: 'warning',
          message: 'High volatility detected in crude oil prices',
          timestamp: '2024-01-05T10:30:00Z',
          severity: 'medium'
        },
        {
          id: '2',
          type: 'info',
          message: 'New trade settlement completed',
          timestamp: '2024-01-05T09:15:00Z',
          severity: 'low'
        },
        {
          id: '3',
          type: 'error',
          message: 'Connection lost to price feed',
          timestamp: '2024-01-05T08:45:00Z',
          severity: 'high'
        }
      ];

      res.json({ success: true, data: alerts });
    } catch (error) {
      logger.error('Get alerts error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}

export const dashboardController = new DashboardController(); 