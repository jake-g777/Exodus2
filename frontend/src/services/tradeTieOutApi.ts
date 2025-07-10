import { 
  TradeTieOutDto, 
  TradeTieOutResultDto, 
  CreateTradeTieOutRequest,
  TradeTieOutResponse,
  TradeTieOutSummary,
  TradeDetails
} from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class TradeTieOutApi {
  
  // Create a new trade tie-out session with results
  static async createTradeTieOut(requestData: CreateTradeTieOutRequest): Promise<TradeTieOutResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/trade-tieouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating trade tie-out:', error);
      throw error;
    }
  }

  // Get all trade tie-outs with summary statistics
  static async getTradeTieOuts(): Promise<{ success: boolean; data: TradeTieOutSummary[]; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/trade-tieouts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error retrieving trade tie-outs:', error);
      throw error;
    }
  }

  // Get trade details for a specific date
  static async getTradeDetails(tradeDate: string): Promise<{ success: boolean; data: TradeDetails[]; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/trade-tieouts/${tradeDate}/details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error retrieving trade details:', error);
      throw error;
    }
  }
} 