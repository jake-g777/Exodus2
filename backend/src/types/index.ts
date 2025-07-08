// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  TRADER = 'trader',
  RISK_MANAGER = 'risk_manager',
  COMPLIANCE = 'compliance',
  VIEWER = 'viewer'
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

// Trade types
export interface Trade {
  id: string;
  tradeId: string;
  commodity: CommodityType;
  side: TradeSide;
  quantity: number;
  price: number;
  currency: string;
  tradeDate: Date;
  settlementDate: Date;
  counterparty: string;
  traderId: string;
  source: TradeSource;
  status: TradeStatus;
  reconciliationStatus: ReconciliationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum CommodityType {
  CRUDE_OIL = 'crude_oil',
  NATURAL_GAS = 'natural_gas',
  ELECTRICITY = 'electricity',
  COAL = 'coal',
  RENEWABLES = 'renewables'
}

export enum TradeSide {
  BUY = 'buy',
  SELL = 'sell'
}

export enum TradeSource {
  TRADER = 'trader',
  RISK_MANAGEMENT = 'risk_management',
  EXTERNAL_SYSTEM = 'external_system'
}

export enum TradeStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SETTLED = 'settled',
  CANCELLED = 'cancelled'
}

export enum ReconciliationStatus {
  PENDING = 'pending',
  MATCHED = 'matched',
  DISCREPANCY = 'discrepancy',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Reconciliation types
export interface ReconciliationRecord {
  id: string;
  tradeId: string;
  traderRecord: Trade;
  riskRecord: Trade;
  status: ReconciliationStatus;
  discrepancies: Discrepancy[];
  approvedBy: string;
  approvedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Discrepancy {
  id: string;
  field: string;
  traderValue: any;
  riskValue: any;
  severity: DiscrepancySeverity;
  description: string;
  resolved: boolean;
  resolvedBy: string;
  resolvedAt: Date;
}

export enum DiscrepancySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Analytics types
export interface ReconciliationAnalytics {
  totalTrades: number;
  matchedTrades: number;
  pendingReconciliation: number;
  discrepanciesFound: number;
  averageResolutionTime: number;
  complianceScore: number;
  dailyReconciliations: DailyReconciliation[];
  commodityBreakdown: CommodityReconciliation[];
  traderPerformance: TraderReconciliation[];
}

export interface DailyReconciliation {
  date: string;
  totalTrades: number;
  matchedTrades: number;
  discrepancies: number;
  resolutionTime: number;
}

export interface CommodityReconciliation {
  commodity: CommodityType;
  totalTrades: number;
  matchedTrades: number;
  discrepancyRate: number;
  averageResolutionTime: number;
}

export interface TraderReconciliation {
  traderId: string;
  traderName: string;
  totalTrades: number;
  matchedTrades: number;
  discrepancyRate: number;
  averageResolutionTime: number;
}

// Dashboard types
export interface DashboardMetrics {
  totalTrades: number;
  pendingReconciliation: number;
  matchedTrades: number;
  discrepanciesFound: number;
  averageResolutionTime: number;
  complianceScore: number;
  riskMetrics: RiskMetrics;
}

export interface RiskMetrics {
  highSeverityDiscrepancies: number;
  criticalDiscrepancies: number;
  unresolvedDiscrepancies: number;
  complianceViolations: number;
}

// WebSocket types
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: Date;
}

export interface TradeUpdate {
  tradeId: string;
  status: TradeStatus;
  reconciliationStatus: ReconciliationStatus;
  updatedAt: Date;
}

export interface PriceUpdate {
  commodity: CommodityType;
  price: number;
  timestamp: Date;
}

export interface ReconciliationUpdate {
  tradeId: string;
  status: ReconciliationStatus;
  updatedAt: Date;
}

export interface DiscrepancyAlert {
  tradeId: string;
  severity: DiscrepancySeverity;
  description: string;
  timestamp: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 