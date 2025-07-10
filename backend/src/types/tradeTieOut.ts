// Trade Tie-Out Types for Oracle Database Integration

export interface TradeTieOutDto {
  tradeTieOutId?: string;
  tradeDate: string;
  sideAFileImport?: string;
  sideAFileName: string;
  sideBFileImport?: string;
  sideBFileName: string;
  userName: string;
  systemTimestamp?: string;
  keyMatrix: Record<string, string>;
  createdDate?: string;
  modifiedDate?: string;
}

export interface TradeTieOutResultDto {
  tradeTieOutResultId?: string;
  ttoTradeTieOutId: string;
  tradeId: string;
  product: string;
  volume: string;
  price: string;
  counterparty: string;
  internalCompany: string;
  status: 'matched' | 'discrepancy' | 'pending';
  userName: string;
  systemDate?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface TradeTieOutSummary {
  tradeDate: string;
  tieOutUser: string;
  systemTimestamp: string;
  totalTrades: number;
  matchedTrades: number;
  pendingTrades: number;
  discrepancyTrades: number;
  matchRate: number;
}

export interface TradeDetails {
  tradeTieOutResultId: string;
  tradeId: string;
  product: string;
  volume: string;
  price: string;
  counterparty: string;
  internalCompany: string;
  status: string;
  userName: string;
  systemDate: string;
  tradeDate: string;
  sideAFileName: string;
  sideBFileName: string;
  tieOutUser: string;
  tieOutTimestamp: string;
}

export interface CreateTradeTieOutRequest {
  tradeDate: string;
  sideAFileImport?: string;
  sideAFileName: string;
  sideBFileImport?: string;
  sideBFileName: string;
  userName: string;
  keyMatrix: Record<string, string>;
  results: Omit<TradeTieOutResultDto, 'tradeTieOutResultId' | 'ttoTradeTieOutId' | 'systemDate' | 'createdDate' | 'modifiedDate'>[];
}

export interface TradeTieOutResponse {
  success: boolean;
  data?: {
    tieOut: TradeTieOutDto;
    results: TradeTieOutResultDto[];
  };
  message?: string;
  error?: string;
} 