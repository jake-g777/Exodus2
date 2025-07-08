import { Request, Response } from 'express';
import { getConnection } from '../database/init';
import { logger } from '../utils/logger';

class TradingController {
  async getTrades(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 10;
      const offset = (page - 1) * limit;

      // Development mode - return mock data
      if (process.env['NODE_ENV'] === 'development') {
        const mockTrades = [
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
            reconciliationStatus: 'matched',
            createdAt: '2024-01-05T10:30:00Z',
            updatedAt: '2024-01-05T10:30:00Z'
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
            reconciliationStatus: 'approved',
            createdAt: '2024-01-05T09:15:00Z',
            updatedAt: '2024-01-05T09:15:00Z'
          }
        ];

        res.json({
          success: true,
          data: mockTrades,
          pagination: {
            page,
            limit,
            total: 2,
            totalPages: 1
          }
        });
        return;
      }

      const connection = await getConnection();
      
      try {
        const query = `
          SELECT * FROM trades 
          ORDER BY createdAt DESC 
          OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
        `;

        const countQuery = 'SELECT COUNT(*) as total FROM trades';

        const [tradesResult, countResult] = await Promise.all([
          connection.execute(query, [offset, limit]),
          connection.execute(countQuery, [])
        ]);

        const trades = tradesResult.rows || [];
        const total = (countResult.rows?.[0] as any)?.[0] || 0;
        const totalPages = Math.ceil(total / limit);

        res.json({
          success: true,
          data: trades,
          pagination: {
            page,
            limit,
            total,
            totalPages
          }
        });
      } finally {
        await connection.close();
      }
    } catch (error) {
      logger.error('Get trades error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async getTradeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Development mode - return mock data
      if (process.env['NODE_ENV'] === 'development') {
        const mockTrade = {
          id: id,
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
          reconciliationStatus: 'matched',
          createdAt: '2024-01-05T10:30:00Z',
          updatedAt: '2024-01-05T10:30:00Z'
        };

        res.json({ success: true, data: mockTrade });
        return;
      }

      const connection = await getConnection();
      
      try {
        const result = await connection.execute(
          'SELECT * FROM trades WHERE id = :id',
          [id]
        );

        if (!result.rows || result.rows.length === 0) {
          res.status(404).json({ success: false, error: 'Trade not found' });
          return;
        }

        res.json({ success: true, data: result.rows[0] });
      } finally {
        await connection.close();
      }
    } catch (error) {
      logger.error('Get trade by ID error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async createTrade(req: Request, res: Response): Promise<void> {
    try {
      const tradeData = req.body;

      // Development mode - return mock success
      if (process.env['NODE_ENV'] === 'development') {
        res.status(201).json({
          success: true,
          message: 'Trade created successfully (mock)',
          data: { id: 'mock-trade-id' }
        });
        return;
      }

      const { v4: uuidv4 } = require('uuid');
      const connection = await getConnection();

      try {
        const now = new Date().toISOString();

        const query = `
          INSERT INTO trades (
            id, tradeId, commodity, side, quantity, price, currency,
            tradeDate, settlementDate, counterparty, traderId, status,
            createdAt, updatedAt
          ) VALUES (:id, :tradeId, :commodity, :side, :quantity, :price, :currency, 
                    :tradeDate, :settlementDate, :counterparty, :traderId, :status, 
                    :createdAt, :updatedAt)
        `;

        const params = [
          uuidv4(),
          tradeData.tradeId || `TRADE-${Date.now()}`,
          tradeData.commodity,
          tradeData.side,
          tradeData.quantity,
          tradeData.price,
          tradeData.currency || 'USD',
          tradeData.tradeDate,
          tradeData.settlementDate,
          tradeData.counterparty,
          (req as any).user.userId,
          tradeData.status || 'pending',
          now,
          now
        ];

        const result = await connection.execute(query, params);
        await connection.commit();

        res.status(201).json({
          success: true,
          message: 'Trade created successfully',
          data: { id: result.lastRowid }
        });
      } finally {
        await connection.close();
      }
    } catch (error) {
      logger.error('Create trade error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async updateTrade(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Development mode - return mock success
      if (process.env['NODE_ENV'] === 'development') {
        res.json({
          success: true,
          message: 'Trade updated successfully (mock)'
        });
        return;
      }

      const now = new Date().toISOString();
      const connection = await getConnection();

      try {
        const query = `
          UPDATE trades SET
            commodity = :commodity, side = :side, quantity = :quantity, 
            price = :price, currency = :currency, tradeDate = :tradeDate, 
            settlementDate = :settlementDate, counterparty = :counterparty, 
            status = :status, updatedAt = :updatedAt
          WHERE id = :id
        `;

        const params = [
          updateData.commodity,
          updateData.side,
          updateData.quantity,
          updateData.price,
          updateData.currency,
          updateData.tradeDate,
          updateData.settlementDate,
          updateData.counterparty,
          updateData.status,
          now,
          id
        ];

        const result = await connection.execute(query, params);
        await connection.commit();

        if (result.rowsAffected === 0) {
          res.status(404).json({ success: false, error: 'Trade not found' });
          return;
        }

        res.json({
          success: true,
          message: 'Trade updated successfully'
        });
      } finally {
        await connection.close();
      }
    } catch (error) {
      logger.error('Update trade error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async deleteTrade(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Development mode - return mock success
      if (process.env['NODE_ENV'] === 'development') {
        res.json({
          success: true,
          message: 'Trade deleted successfully (mock)'
        });
        return;
      }

      const connection = await getConnection();

      try {
        const result = await connection.execute(
          'DELETE FROM trades WHERE id = :id',
          [id]
        );
        await connection.commit();

        if (result.rowsAffected === 0) {
          res.status(404).json({ success: false, error: 'Trade not found' });
          return;
        }

        res.json({
          success: true,
          message: 'Trade deleted successfully'
        });
      } finally {
        await connection.close();
      }
    } catch (error) {
      logger.error('Delete trade error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async getTradesByCommodity(req: Request, res: Response): Promise<void> {
    try {
      const { commodity } = req.params;

      // Development mode - return mock data
      if (process.env['NODE_ENV'] === 'development') {
        const mockTrades = [
          {
            id: '1',
            tradeId: 'TRADE-001',
            commodity: commodity,
            side: 'buy',
            quantity: 1000,
            price: 85.50,
            currency: 'USD',
            tradeDate: '2024-01-05T10:30:00Z',
            settlementDate: '2024-01-07T10:30:00Z',
            counterparty: 'Shell Trading',
            status: 'confirmed',
            reconciliationStatus: 'matched',
            createdAt: '2024-01-05T10:30:00Z',
            updatedAt: '2024-01-05T10:30:00Z'
          }
        ];

        res.json({
          success: true,
          data: mockTrades
        });
        return;
      }

      const connection = await getConnection();

      try {
        const result = await connection.execute(
          'SELECT * FROM trades WHERE commodity = :commodity ORDER BY createdAt DESC',
          [commodity]
        );

        res.json({
          success: true,
          data: result.rows || []
        });
      } finally {
        await connection.close();
      }
    } catch (error) {
      logger.error('Get trades by commodity error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }

  async getTradesByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;

      // Development mode - return mock data
      if (process.env['NODE_ENV'] === 'development') {
        const mockTrades = [
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
            status: status,
            reconciliationStatus: 'matched',
            createdAt: '2024-01-05T10:30:00Z',
            updatedAt: '2024-01-05T10:30:00Z'
          }
        ];

        res.json({
          success: true,
          data: mockTrades
        });
        return;
      }

      const connection = await getConnection();

      try {
        const result = await connection.execute(
          'SELECT * FROM trades WHERE status = :status ORDER BY createdAt DESC',
          [status]
        );

        res.json({
          success: true,
          data: result.rows || []
        });
      } finally {
        await connection.close();
      }
    } catch (error) {
      logger.error('Get trades by status error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
}

export const tradingController = new TradingController(); 