import { Request, Response } from 'express';
import { getConnection } from '../database/init';
import { logger } from '../utils/logger';
import { 
  TradeTieOutDto, 
  TradeTieOutResultDto, 
  CreateTradeTieOutRequest,
  TradeTieOutResponse,
  TradeTieOutSummary,
  TradeDetails
} from '../types/tradeTieOut';

export class TradeTieOutController {
  
  // Create a new trade tie-out session with results
  static async createTradeTieOut(req: Request, res: Response): Promise<void> {
    try {
      const requestData: CreateTradeTieOutRequest = req.body;
      
      if (process.env.NODE_ENV === 'development') {
        // Return mock data in development
        const mockResponse: TradeTieOutResponse = {
          success: true,
          data: {
            tieOut: {
              tradeTieOutId: 'MOCK_' + Date.now(),
              tradeDate: requestData.tradeDate,
              sideAFileName: requestData.sideAFileName,
              sideBFileName: requestData.sideBFileName,
              userName: requestData.userName,
              systemTimestamp: new Date().toISOString(),
              keyMatrix: requestData.keyMatrix,
              createdDate: new Date().toISOString(),
              modifiedDate: new Date().toISOString()
            },
            results: requestData.results.map((result, index) => ({
              tradeTieOutResultId: 'MOCK_RESULT_' + Date.now() + '_' + index,
              ttoTradeTieOutId: 'MOCK_' + Date.now(),
              ...result,
              systemDate: new Date().toISOString(),
              createdDate: new Date().toISOString(),
              modifiedDate: new Date().toISOString()
            }))
          },
          message: 'Trade tie-out created successfully (mock data)'
        };
        
        res.status(201).json(mockResponse);
        return;
      }

      const connection = await getConnection();
      
      try {
        await connection.execute('BEGIN');
        
        // Insert trade tie-out record
        const tieOutResult = await connection.execute(
          `INSERT INTO TRADE_TIE_OUTS (
            TRADE_DATE, SIDE_A_FILE_IMPORT, SIDE_A_FILE_NAME, 
            SIDE_B_FILE_IMPORT, SIDE_B_FILE_NAME, USER_NAME, 
            SYSTEM_TIMESTAMP, KEY_MATRIX
          ) VALUES (
            TO_DATE(:tradeDate, 'YYYY-MM-DD'), :sideAFileImport, :sideAFileName,
            :sideBFileImport, :sideBFileName, :userName,
            SYSTIMESTAMP, :keyMatrix
          ) RETURNING TRADE_TIE_OUT_ID INTO :tradeTieOutId`,
          {
            tradeDate: requestData.tradeDate,
            sideAFileImport: requestData.sideAFileImport || null,
            sideAFileName: requestData.sideAFileName,
            sideBFileImport: requestData.sideBFileImport || null,
            sideBFileName: requestData.sideBFileName,
            userName: requestData.userName,
            keyMatrix: JSON.stringify(requestData.keyMatrix),
            tradeTieOutId: { type: 'VARCHAR2', dir: 3000, maxSize: 50 }
          }
        );
        
        const tradeTieOutId = (tieOutResult.outBinds as any)?.tradeTieOutId?.[0];
        
        if (!tradeTieOutId) {
          throw new Error('Failed to get trade tie-out ID');
        }
        
        // Insert trade tie-out results
        const results: TradeTieOutResultDto[] = [];
        
        for (const result of requestData.results) {
          const resultInsert = await connection.execute(
            `INSERT INTO TRADE_TIE_OUT_RESULTS (
              TTO_TRADE_TIE_OUT_ID, TRADE_ID, PRODUCT, VOLUME, PRICE,
              COUNTERPARTY, INTERNAL_COMPANY, STATUS, USER_NAME, SYSTEM_DATE
            ) VALUES (
              :ttoTradeTieOutId, :tradeId, :product, :volume, :price,
              :counterparty, :internalCompany, :status, :userName, SYSTIMESTAMP
            ) RETURNING TRADE_TIE_OUT_RESULT_ID INTO :tradeTieOutResultId`,
            {
              ttoTradeTieOutId: tradeTieOutId,
              tradeId: result.tradeId,
              product: result.product,
              volume: result.volume,
              price: result.price,
              counterparty: result.counterparty,
              internalCompany: result.internalCompany,
              status: result.status,
              userName: result.userName,
              tradeTieOutResultId: { type: 'VARCHAR2', dir: 3000, maxSize: 50 }
            }
          );
          
          const resultId = (resultInsert.outBinds as any)?.tradeTieOutResultId?.[0];
          
          results.push({
            tradeTieOutResultId: resultId,
            ttoTradeTieOutId: tradeTieOutId,
            ...result,
            systemDate: new Date().toISOString(),
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString()
          });
        }
        
        await connection.commit();
        
        // Get the complete tie-out record
        const tieOutQuery = await connection.execute(
          `SELECT * FROM TRADE_TIE_OUTS WHERE TRADE_TIE_OUT_ID = :tradeTieOutId`,
          { tradeTieOutId }
        );
        
        const tieOutRecord = tieOutQuery.rows?.[0] as any;
        
        const response: TradeTieOutResponse = {
          success: true,
          data: {
            tieOut: {
              tradeTieOutId,
              tradeDate: tieOutRecord?.[1]?.toISOString().split('T')[0] || requestData.tradeDate,
              sideAFileImport: tieOutRecord?.[2] || requestData.sideAFileImport,
              sideAFileName: tieOutRecord?.[3] || requestData.sideAFileName,
              sideBFileImport: tieOutRecord?.[4] || requestData.sideBFileImport,
              sideBFileName: tieOutRecord?.[5] || requestData.sideBFileName,
              userName: tieOutRecord?.[6] || requestData.userName,
              systemTimestamp: tieOutRecord?.[7]?.toISOString() || new Date().toISOString(),
              keyMatrix: JSON.parse(tieOutRecord?.[8] || '{}'),
              createdDate: tieOutRecord?.[9]?.toISOString() || new Date().toISOString(),
              modifiedDate: tieOutRecord?.[10]?.toISOString() || new Date().toISOString()
            },
            results
          },
          message: `Trade tie-out created successfully with ${results.length} results`
        };
        
        res.status(201).json(response);
        
      } finally {
        await connection.close();
      }
      
    } catch (error) {
      logger.error('Error creating trade tie-out:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create trade tie-out',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  // Get all trade tie-outs with summary statistics
  static async getTradeTieOuts(req: Request, res: Response): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Return mock data in development
        const mockSummaries: TradeTieOutSummary[] = [
          {
            tradeDate: '2024-01-15',
            tieOutUser: 'john.doe',
            systemTimestamp: '2024-01-15T10:30:00Z',
            totalTrades: 45,
            matchedTrades: 42,
            pendingTrades: 2,
            discrepancyTrades: 1,
            matchRate: 93.3
          },
          {
            tradeDate: '2024-01-14',
            tieOutUser: 'jane.smith',
            systemTimestamp: '2024-01-14T09:15:00Z',
            totalTrades: 38,
            matchedTrades: 37,
            pendingTrades: 1,
            discrepancyTrades: 0,
            matchRate: 97.4
          }
        ];
        
        res.json({
          success: true,
          data: mockSummaries,
          message: 'Trade tie-outs retrieved successfully (mock data)'
        });
        return;
      }
      
      const connection = await getConnection();
      
      try {
        const result = await connection.execute(
          `SELECT * FROM V_TRADE_TIE_OUT_SUMMARY ORDER BY TRADE_DATE DESC, SYSTEM_TIMESTAMP DESC`
        );
        
        const summaries: TradeTieOutSummary[] = (result.rows || []).map(row => ({
          tradeDate: row?.[0]?.toISOString().split('T')[0] || '',
          tieOutUser: row?.[1] || '',
          systemTimestamp: row?.[2]?.toISOString() || '',
          totalTrades: Number(row?.[3]) || 0,
          matchedTrades: Number(row?.[4]) || 0,
          pendingTrades: Number(row?.[5]) || 0,
          discrepancyTrades: Number(row?.[6]) || 0,
          matchRate: Number(row?.[7]) || 0
        }));
        
        res.json({
          success: true,
          data: summaries,
          message: 'Trade tie-outs retrieved successfully'
        });
        
      } finally {
        await connection.close();
      }
      
    } catch (error) {
      logger.error('Error retrieving trade tie-outs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve trade tie-outs',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  // Get trade details for a specific date
  static async getTradeDetails(req: Request, res: Response): Promise<void> {
    try {
      const { tradeDate } = req.params;
      
      if (process.env.NODE_ENV === 'development') {
        // Return mock data in development
        const mockDetails: TradeDetails[] = [
          {
            tradeTieOutResultId: 'MOCK_RESULT_1',
            tradeId: 'TRADE-001',
            product: 'Crude Oil',
            volume: '1000 barrels',
            price: '$85.50',
            counterparty: 'Shell Trading',
            internalCompany: 'Exodus Energy',
            status: 'matched',
            userName: 'john.doe',
            systemDate: '2024-01-15T10:30:00Z',
            tradeDate: '2024-01-15',
            sideAFileName: 'trader_records_2024-01-15.xlsx',
            sideBFileName: 'risk_records_2024-01-15.xlsx',
            tieOutUser: 'john.doe',
            tieOutTimestamp: '2024-01-15T10:30:00Z'
          }
        ];
        
        res.json({
          success: true,
          data: mockDetails,
          message: 'Trade details retrieved successfully (mock data)'
        });
        return;
      }
      
      const connection = await getConnection();
      
      try {
        const result = await connection.execute(
          `SELECT * FROM V_TRADE_DETAILS WHERE TRADE_DATE = TO_DATE(:tradeDate, 'YYYY-MM-DD') ORDER BY SYSTEM_DATE DESC`,
          { tradeDate }
        );
        
        const details: TradeDetails[] = (result.rows || []).map(row => ({
          tradeTieOutResultId: row?.[0] || '',
          tradeId: row?.[1] || '',
          product: row?.[2] || '',
          volume: row?.[3] || '',
          price: row?.[4] || '',
          counterparty: row?.[5] || '',
          internalCompany: row?.[6] || '',
          status: row?.[7] || '',
          userName: row?.[8] || '',
          systemDate: row?.[9]?.toISOString() || '',
          tradeDate: row?.[10]?.toISOString().split('T')[0] || '',
          sideAFileName: row?.[11] || '',
          sideBFileName: row?.[12] || '',
          tieOutUser: row?.[13] || '',
          tieOutTimestamp: row?.[14]?.toISOString() || ''
        }));
        
        res.json({
          success: true,
          data: details,
          message: 'Trade details retrieved successfully'
        });
        
      } finally {
        await connection.close();
      }
      
    } catch (error) {
      logger.error('Error retrieving trade details:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve trade details',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 