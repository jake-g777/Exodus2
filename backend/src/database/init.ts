import oracledb from 'oracledb';
import { logger } from '../utils/logger';

// Oracle database configuration
const dbConfig = {
  user: process.env['DB_USER'] || 'zenith_dba',
  password: process.env['DB_PASSWORD'] || 'ZENITH2023!!',
  connectString: process.env['DB_CONNECT_STRING'] || '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=db.runescapeproj.com)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=DBRUNESCAPEPROJ)))',
  poolMin: 10,
  poolMax: 10,
  poolIncrement: 0
};

let pool: oracledb.Pool | null = null;

export async function initializeDatabase(): Promise<void> {
  try {
    // Skip database connection in development mode
    const nodeEnv = process.env['NODE_ENV'] || 'development';
    logger.info(`Current NODE_ENV: ${nodeEnv}`);
    
    if (nodeEnv === 'development') {
      logger.info('Running in development mode - skipping database connection');
      logger.info('Using mock data for development');
      return;
    }

    logger.info('Attempting to create Oracle database pool...');
    // Create connection pool
    pool = await oracledb.createPool(dbConfig);
    logger.info('Oracle database pool created successfully');

    // Test connection
    const connection = await pool.getConnection();
    await connection.close();
    logger.info('Oracle database connection test successful');

    // Initialize tables
    await createTables();
    logger.info('Database tables initialized successfully');

  } catch (error) {
    logger.error('Database initialization error:', error);
    throw error;
  }
}

async function createTables(): Promise<void> {
  const connection = await pool!.getConnection();
  
  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE users (
        id VARCHAR2(36) PRIMARY KEY,
        email VARCHAR2(255) UNIQUE NOT NULL,
        password VARCHAR2(255) NOT NULL,
        firstName VARCHAR2(100) NOT NULL,
        lastName VARCHAR2(100) NOT NULL,
        role VARCHAR2(20) DEFAULT 'viewer' NOT NULL,
        isActive NUMBER(1) DEFAULT 1 NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);

    // Create refresh_tokens table
    await connection.execute(`
      CREATE TABLE refresh_tokens (
        id VARCHAR2(36) PRIMARY KEY,
        userId VARCHAR2(36) NOT NULL,
        token VARCHAR2(500) NOT NULL,
        expiresAt TIMESTAMP NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Create trades table
    await connection.execute(`
      CREATE TABLE trades (
        id VARCHAR2(36) PRIMARY KEY,
        tradeId VARCHAR2(100) UNIQUE NOT NULL,
        commodity VARCHAR2(20) NOT NULL,
        side VARCHAR2(10) NOT NULL,
        quantity NUMBER(15,2) NOT NULL,
        price NUMBER(15,2) NOT NULL,
        currency VARCHAR2(3) DEFAULT 'USD' NOT NULL,
        tradeDate DATE NOT NULL,
        settlementDate DATE NOT NULL,
        counterparty VARCHAR2(100) NOT NULL,
        traderId VARCHAR2(36) NOT NULL,
        source VARCHAR2(20) DEFAULT 'trader' NOT NULL,
        status VARCHAR2(20) DEFAULT 'pending' NOT NULL,
        reconciliationStatus VARCHAR2(20) DEFAULT 'pending' NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (traderId) REFERENCES users(id)
      )
    `);

    // Create reconciliation_records table
    await connection.execute(`
      CREATE TABLE reconciliation_records (
        id VARCHAR2(36) PRIMARY KEY,
        tradeId VARCHAR2(36) NOT NULL,
        traderRecordId VARCHAR2(36) NOT NULL,
        riskRecordId VARCHAR2(36) NOT NULL,
        status VARCHAR2(20) DEFAULT 'pending' NOT NULL,
        approvedBy VARCHAR2(36),
        approvedAt TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (tradeId) REFERENCES trades(id),
        FOREIGN KEY (traderRecordId) REFERENCES trades(id),
        FOREIGN KEY (riskRecordId) REFERENCES trades(id),
        FOREIGN KEY (approvedBy) REFERENCES users(id)
      )
    `);

    // Create discrepancies table
    await connection.execute(`
      CREATE TABLE discrepancies (
        id VARCHAR2(36) PRIMARY KEY,
        reconciliationRecordId VARCHAR2(36) NOT NULL,
        field VARCHAR2(50) NOT NULL,
        traderValue CLOB,
        riskValue CLOB,
        severity VARCHAR2(20) DEFAULT 'medium' NOT NULL,
        description VARCHAR2(500),
        resolved NUMBER(1) DEFAULT 0 NOT NULL,
        resolvedBy VARCHAR2(36),
        resolvedAt TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (reconciliationRecordId) REFERENCES reconciliation_records(id),
        FOREIGN KEY (resolvedBy) REFERENCES users(id)
      )
    `);

    // Create audit_log table
    await connection.execute(`
      CREATE TABLE audit_log (
        id VARCHAR2(36) PRIMARY KEY,
        userId VARCHAR2(36),
        action VARCHAR2(50) NOT NULL,
        tableName VARCHAR2(50) NOT NULL,
        recordId VARCHAR2(36),
        oldValues CLOB,
        newValues CLOB,
        ipAddress VARCHAR2(45),
        userAgent VARCHAR2(500),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Create trade tie-out tables
    await createTradeTieOutTables(connection);

    await connection.commit();
    logger.info('All database tables created successfully');

  } catch (error: any) {
    // If table already exists, that's fine
    if (error.code === 955) { // ORA-00955: name is already being used by an existing object
      logger.info('Tables already exist, skipping creation');
    } else {
      logger.error('Error creating tables:', error);
      throw error;
    }
  } finally {
    await connection.close();
  }
}

async function createTradeTieOutTables(connection: oracledb.Connection): Promise<void> {
  try {
    // Create sequences
    await connection.execute(`
      CREATE SEQUENCE TRADE_TIE_OUTS_SEQ 
      MINVALUE 1 MAXVALUE 9999999999999999999999999999 
      INCREMENT BY 1 START WITH 1 NOCACHE ORDER NOCYCLE NOKEEP NOSCALE GLOBAL
    `);
    
    await connection.execute(`
      CREATE SEQUENCE TRADE_TIE_OUT_RESULTS_SEQ 
      MINVALUE 1 MAXVALUE 9999999999999999999999999999 
      INCREMENT BY 1 START WITH 1 NOCACHE ORDER NOCYCLE NOKEEP NOSCALE GLOBAL
    `);

    // Create TRADE_TIE_OUTS table
    await connection.execute(`
      CREATE TABLE TRADE_TIE_OUTS (
        TRADE_TIE_OUT_ID VARCHAR2(50) DEFAULT ON NULL TRADE_TIE_OUTS_SEQ.NEXTVAL NOT NULL ENABLE,
        TRADE_DATE DATE NOT NULL,
        SIDE_A_FILE_IMPORT CLOB,
        SIDE_A_FILE_NAME VARCHAR2(255) NOT NULL,
        SIDE_B_FILE_IMPORT CLOB,
        SIDE_B_FILE_NAME VARCHAR2(255) NOT NULL,
        USER_NAME VARCHAR2(100) NOT NULL,
        SYSTEM_TIMESTAMP TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
        KEY_MATRIX CLOB,
        CREATED_DATE TIMESTAMP DEFAULT SYSTIMESTAMP,
        MODIFIED_DATE TIMESTAMP DEFAULT SYSTIMESTAMP,
        CONSTRAINT PK_TRADE_TIE_OUTS PRIMARY KEY (TRADE_TIE_OUT_ID)
      )
    `);

    // Create TRADE_TIE_OUT_RESULTS table
    await connection.execute(`
      CREATE TABLE TRADE_TIE_OUT_RESULTS (
        TRADE_TIE_OUT_RESULT_ID VARCHAR2(50) DEFAULT ON NULL TRADE_TIE_OUT_RESULTS_SEQ.NEXTVAL NOT NULL ENABLE,
        TTO_TRADE_TIE_OUT_ID VARCHAR2(50) NOT NULL,
        TRADE_ID VARCHAR2(100) NOT NULL,
        PRODUCT VARCHAR2(200),
        VOLUME VARCHAR2(100),
        PRICE VARCHAR2(50),
        COUNTERPARTY VARCHAR2(200),
        INTERNAL_COMPANY VARCHAR2(200),
        STATUS VARCHAR2(20) NOT NULL,
        USER_NAME VARCHAR2(100) NOT NULL,
        SYSTEM_DATE TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
        CREATED_DATE TIMESTAMP DEFAULT SYSTIMESTAMP,
        MODIFIED_DATE TIMESTAMP DEFAULT SYSTIMESTAMP,
        CONSTRAINT PK_TRADE_TIE_OUT_RESULTS PRIMARY KEY (TRADE_TIE_OUT_RESULT_ID),
        CONSTRAINT FK_TRADE_RESULTS_PARENT FOREIGN KEY (TTO_TRADE_TIE_OUT_ID) 
          REFERENCES TRADE_TIE_OUTS(TRADE_TIE_OUT_ID) ON DELETE CASCADE,
        CONSTRAINT CK_TRADE_STATUS CHECK (STATUS IN ('matched', 'discrepancy', 'pending'))
      )
    `);

    // Create indexes
    await connection.execute('CREATE INDEX IDX_TRADE_TIE_OUTS_DATE ON TRADE_TIE_OUTS(TRADE_DATE)');
    await connection.execute('CREATE INDEX IDX_TRADE_TIE_OUTS_USER ON TRADE_TIE_OUTS(USER_NAME)');
    await connection.execute('CREATE INDEX IDX_TRADE_TIE_OUTS_TIMESTAMP ON TRADE_TIE_OUTS(SYSTEM_TIMESTAMP)');
    await connection.execute('CREATE INDEX IDX_TRADE_RESULTS_PARENT ON TRADE_TIE_OUT_RESULTS(TTO_TRADE_TIE_OUT_ID)');
    await connection.execute('CREATE INDEX IDX_TRADE_RESULTS_TRADE_ID ON TRADE_TIE_OUT_RESULTS(TRADE_ID)');
    await connection.execute('CREATE INDEX IDX_TRADE_RESULTS_STATUS ON TRADE_TIE_OUT_RESULTS(STATUS)');
    await connection.execute('CREATE INDEX IDX_TRADE_RESULTS_COUNTERPARTY ON TRADE_TIE_OUT_RESULTS(COUNTERPARTY)');
    await connection.execute('CREATE INDEX IDX_TRADE_RESULTS_PRODUCT ON TRADE_TIE_OUT_RESULTS(PRODUCT)');
    await connection.execute('CREATE INDEX IDX_TRADE_RESULTS_USER ON TRADE_TIE_OUT_RESULTS(USER_NAME)');
    await connection.execute('CREATE INDEX IDX_TRADE_RESULTS_DATE ON TRADE_TIE_OUT_RESULTS(SYSTEM_DATE)');

    // Create views
    await connection.execute(`
      CREATE OR REPLACE VIEW V_TRADE_TIE_OUT_SUMMARY AS
      SELECT 
        t.TRADE_DATE,
        t.USER_NAME as TIE_OUT_USER,
        t.SYSTEM_TIMESTAMP,
        COUNT(r.TRADE_TIE_OUT_RESULT_ID) as TOTAL_TRADES,
        SUM(CASE WHEN r.STATUS = 'matched' THEN 1 ELSE 0 END) as MATCHED_TRADES,
        SUM(CASE WHEN r.STATUS = 'pending' THEN 1 ELSE 0 END) as PENDING_TRADES,
        SUM(CASE WHEN r.STATUS = 'discrepancy' THEN 1 ELSE 0 END) as DISCREPANCY_TRADES,
        CASE 
          WHEN COUNT(r.TRADE_TIE_OUT_RESULT_ID) > 0 
          THEN ROUND((SUM(CASE WHEN r.STATUS = 'matched' THEN 1 ELSE 0 END) / COUNT(r.TRADE_TIE_OUT_RESULT_ID)) * 100, 1)
          ELSE 0 
        END as MATCH_RATE
      FROM TRADE_TIE_OUTS t
      LEFT JOIN TRADE_TIE_OUT_RESULTS r ON t.TRADE_TIE_OUT_ID = r.TTO_TRADE_TIE_OUT_ID
      GROUP BY t.TRADE_DATE, t.USER_NAME, t.SYSTEM_TIMESTAMP
      ORDER BY t.TRADE_DATE DESC, t.SYSTEM_TIMESTAMP DESC
    `);

    await connection.execute(`
      CREATE OR REPLACE VIEW V_TRADE_DETAILS AS
      SELECT 
        r.TRADE_TIE_OUT_RESULT_ID,
        r.TRADE_ID,
        r.PRODUCT,
        r.VOLUME,
        r.PRICE,
        r.COUNTERPARTY,
        r.INTERNAL_COMPANY,
        r.STATUS,
        r.USER_NAME,
        r.SYSTEM_DATE,
        t.TRADE_DATE,
        t.SIDE_A_FILE_NAME,
        t.SIDE_B_FILE_NAME,
        t.USER_NAME as TIE_OUT_USER,
        t.SYSTEM_TIMESTAMP as TIE_OUT_TIMESTAMP
      FROM TRADE_TIE_OUT_RESULTS r
      JOIN TRADE_TIE_OUTS t ON r.TTO_TRADE_TIE_OUT_ID = t.TRADE_TIE_OUT_ID
      ORDER BY t.TRADE_DATE DESC, r.SYSTEM_DATE DESC
    `);

    logger.info('Trade tie-out tables created successfully');

  } catch (error: any) {
    // If table already exists, that's fine
    if (error.code === 955) { // ORA-00955: name is already being used by an existing object
      logger.info('Trade tie-out tables already exist, skipping creation');
    } else {
      logger.error('Error creating trade tie-out tables:', error);
      throw error;
    }
  }
}

export async function getConnection(): Promise<oracledb.Connection> {
  if (process.env['NODE_ENV'] === 'development') {
    throw new Error('Database connection not available in development mode - using mock data');
  }
  
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return await pool.getConnection();
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.close();
    logger.info('Database pool closed');
  }
}

// Export pool for direct access if needed
export { pool }; 