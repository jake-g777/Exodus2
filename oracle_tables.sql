-- Oracle Database Tables for Trade Tie-Out System
-- Created for Exodus2 Trading Application

-- =====================================================
-- Parent Table: TRADE_TIE_OUTS
-- Stores the main tie-out session information
-- =====================================================
CREATE SEQUENCE  TRADE_TIE_OUTS_SEQ  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 14 NOCACHE  ORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
CREATE TABLE TRADE_TIE_OUTS (
    TRADE_TIE_OUT_ID VARCHAR2(50) DEFAULT ON NULL TRADE_TIE_OUTS_SEQ.NEXTVAL NOT NULL ENABLE,
    TRADE_DATE DATE NOT NULL,
    SIDE_A_FILE_IMPORT CLOB, -- For storing file content as text
    SIDE_A_FILE_NAME VARCHAR2(255) NOT NULL,
    SIDE_B_FILE_IMPORT CLOB, -- For storing file content as text
    SIDE_B_FILE_NAME VARCHAR2(255) NOT NULL,
    USER_NAME VARCHAR2(100) NOT NULL,
    SYSTEM_TIMESTAMP TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    KEY_MATRIX CLOB, -- JSON string for column mappings
    CREATED_DATE TIMESTAMP DEFAULT SYSTIMESTAMP,
    MODIFIED_DATE TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT PK_TRADE_TIE_OUTS PRIMARY KEY (TRADE_TIE_OUT_ID)
);

-- =====================================================
-- Child Table: TRADE_TIE_OUT_RESULTS
-- Stores individual trade comparison results
-- =====================================================
CREATE SEQUENCE  TRADE_TIE_OUT_RESULTS_SEQ  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 14 NOCACHE  ORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
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
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Indexes on TRADE_TIE_OUTS
CREATE INDEX IDX_TRADE_TIE_OUTS_DATE ON TRADE_TIE_OUTS(TRADE_DATE);
CREATE INDEX IDX_TRADE_TIE_OUTS_USER ON TRADE_TIE_OUTS(USER_NAME);
CREATE INDEX IDX_TRADE_TIE_OUTS_TIMESTAMP ON TRADE_TIE_OUTS(SYSTEM_TIMESTAMP);

-- Indexes on TRADE_TIE_OUT_RESULTS
CREATE INDEX IDX_TRADE_RESULTS_PARENT ON TRADE_TIE_OUT_RESULTS(TTO_TRADE_TIE_OUT_ID);
CREATE INDEX IDX_TRADE_RESULTS_TRADE_ID ON TRADE_TIE_OUT_RESULTS(TRADE_ID);
CREATE INDEX IDX_TRADE_RESULTS_STATUS ON TRADE_TIE_OUT_RESULTS(STATUS);
CREATE INDEX IDX_TRADE_RESULTS_COUNTERPARTY ON TRADE_TIE_OUT_RESULTS(COUNTERPARTY);
CREATE INDEX IDX_TRADE_RESULTS_PRODUCT ON TRADE_TIE_OUT_RESULTS(PRODUCT);
CREATE INDEX IDX_TRADE_RESULTS_USER ON TRADE_TIE_OUT_RESULTS(USER_NAME);
CREATE INDEX IDX_TRADE_RESULTS_DATE ON TRADE_TIE_OUT_RESULTS(SYSTEM_DATE);

-- =====================================================
-- Comments for Documentation
-- =====================================================

COMMENT ON TABLE TRADE_TIE_OUTS IS 'Stores trade tie-out sessions comparing trader and risk management records';
COMMENT ON COLUMN TRADE_TIE_OUTS.TRADE_TIE_OUT_ID IS 'Unique identifier for the tie-out session';
COMMENT ON COLUMN TRADE_TIE_OUTS.TRADE_DATE IS 'Date of the trades being compared';
COMMENT ON COLUMN TRADE_TIE_OUTS.SIDE_A_FILE_IMPORT IS 'Content of the trader records file (Side A)';
COMMENT ON COLUMN TRADE_TIE_OUTS.SIDE_A_FILE_NAME IS 'Original filename of the trader records file';
COMMENT ON COLUMN TRADE_TIE_OUTS.SIDE_B_FILE_IMPORT IS 'Content of the risk management records file (Side B)';
COMMENT ON COLUMN TRADE_TIE_OUTS.SIDE_B_FILE_NAME IS 'Original filename of the risk management records file';
COMMENT ON COLUMN TRADE_TIE_OUTS.USER_NAME IS 'Username of the person who performed the tie-out';
COMMENT ON COLUMN TRADE_TIE_OUTS.SYSTEM_TIMESTAMP IS 'When the tie-out was performed';
COMMENT ON COLUMN TRADE_TIE_OUTS.KEY_MATRIX IS 'JSON mapping of column names between Side A and Side B files';

COMMENT ON TABLE TRADE_TIE_OUT_RESULTS IS 'Individual trade comparison results from tie-out sessions';
COMMENT ON COLUMN TRADE_TIE_OUT_RESULTS.TRADE_TIE_OUT_RESULT_ID IS 'Unique identifier for the trade result';
COMMENT ON COLUMN TRADE_TIE_OUT_RESULTS.TTO_TRADE_TIE_OUT_ID IS 'Reference to the parent tie-out session';
COMMENT ON COLUMN TRADE_TIE_OUT_RESULTS.TRADE_ID IS 'Unique identifier for the trade';
COMMENT ON COLUMN TRADE_TIE_OUT_RESULTS.PRODUCT IS 'Commodity or product being traded';
COMMENT ON COLUMN TRADE_TIE_OUT_RESULTS.VOLUME IS 'Quantity and units of the trade';
COMMENT ON COLUMN TRADE_TIE_OUT_RESULTS.PRICE IS 'Price per unit of the trade';
COMMENT ON COLUMN TRADE_TIE_OUT_RESULTS.COUNTERPARTY IS 'External trading partner';
COMMENT ON COLUMN TRADE_TIE_OUT_RESULTS.INTERNAL_COMPANY IS 'Internal company identifier';
COMMENT ON COLUMN TRADE_TIE_OUT_RESULTS.STATUS IS 'Comparison status: matched, discrepancy, or pending';
COMMENT ON COLUMN TRADE_TIE_OUT_RESULTS.USER_NAME IS 'Username of the person who processed this result';
COMMENT ON COLUMN TRADE_TIE_OUT_RESULTS.SYSTEM_DATE IS 'When this result was processed';

-- =====================================================
-- Triggers for Audit Trail
-- =====================================================

-- Trigger to update MODIFIED_DATE on TRADE_TIE_OUTS
CREATE OR REPLACE TRIGGER TR_TRADE_TIE_OUTS_MODIFIED
    BEFORE UPDATE ON TRADE_TIE_OUTS
    FOR EACH ROW
BEGIN
    :NEW.MODIFIED_DATE := SYSTIMESTAMP;
END;
/

-- Trigger to update MODIFIED_DATE on TRADE_TIE_OUT_RESULTS
CREATE OR REPLACE TRIGGER TR_TRADE_RESULTS_MODIFIED
    BEFORE UPDATE ON TRADE_TIE_OUT_RESULTS
    FOR EACH ROW
BEGIN
    :NEW.MODIFIED_DATE := SYSTIMESTAMP;
END;
/

-- =====================================================
-- Sample Data Insertion (Optional)
-- =====================================================

/*
-- Example of how to insert sample data
INSERT INTO TRADE_TIE_OUTS (
    TRADE_DATE,
    SIDE_A_FILE_NAME,
    SIDE_B_FILE_NAME,
    USER_NAME,
    KEY_MATRIX
) VALUES (
    TO_DATE('2024-01-15', 'YYYY-MM-DD'),
    'trader_records_2024-01-15.xlsx',
    'risk_records_2024-01-15.xlsx',
    'john.doe',
    '{"Trade ID": "Trade ID", "Product": "Commodity", "Volume": "Quantity"}'
);

INSERT INTO TRADE_TIE_OUT_RESULTS (
    TTO_TRADE_TIE_OUT_ID,
    TRADE_ID,
    PRODUCT,
    VOLUME,
    PRICE,
    COUNTERPARTY,
    INTERNAL_COMPANY,
    STATUS,
    USER_NAME
) VALUES (
    (SELECT TRADE_TIE_OUT_ID FROM TRADE_TIE_OUTS WHERE ROWNUM = 1 ORDER BY TRADE_TIE_OUT_ID DESC),
    'TRADE-001',
    'Crude Oil',
    '1000 barrels',
    '$85.50',
    'Shell Trading',
    'Exodus Energy',
    'matched',
    'john.doe'
);
*/

-- =====================================================
-- Useful Views for Reporting
-- =====================================================

-- View for daily summary statistics
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
ORDER BY t.TRADE_DATE DESC, t.SYSTEM_TIMESTAMP DESC;

-- View for trade details with tie-out information
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
ORDER BY t.TRADE_DATE DESC, r.SYSTEM_DATE DESC;

-- =====================================================
-- Grants (adjust schema names as needed)
-- =====================================================

-- Grant permissions to application user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TRADE_TIE_OUTS TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TRADE_TIE_OUT_RESULTS TO your_app_user;
-- GRANT SELECT ON V_TRADE_TIE_OUT_SUMMARY TO your_app_user;
-- GRANT SELECT ON V_TRADE_DETAILS TO your_app_user; 