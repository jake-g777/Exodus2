# Oracle Database Setup for Trade Tie-Out System

This guide will help you set up the Oracle database connection and create the necessary tables for the trade tie-out functionality.

## Prerequisites

1. **Oracle Database Access**: You need access to an Oracle database (version 11g or higher)
2. **Node.js**: Version 16 or higher
3. **Oracle Client**: The `oracledb` npm package will handle the client connection

## Database Configuration

### 1. Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
DB_USER=zenith_dba
DB_PASSWORD=ZENITH2023!!
DB_CONNECT_STRING=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=db.dumpy.com)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=devdumpydb)))

# Server Configuration
PORT=5000
NODE_ENV=production  # Change to 'production' to enable database connection

# Other configurations...
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

### 2. Database Tables

Run the `oracle_tables.sql` script in your Oracle database to create the necessary tables:

```sql
-- Execute this in your Oracle database
@oracle_tables.sql
```

This will create:
- **TRADE_TIE_OUTS**: Main table for trade tie-out sessions
- **TRADE_TIE_OUT_RESULTS**: Individual trade comparison results
- **Sequences**: For auto-incrementing IDs
- **Indexes**: For performance optimization
- **Views**: For reporting and summaries
- **Triggers**: For audit trail

## Testing the Connection

### 1. Test Database Connection

Run the test script to verify your database connection:

```bash
cd backend
node test_db_connection.js
```

Expected output:
```
🔌 Testing Oracle database connection...
✅ Database connection successful!
📅 Current database time: 2024-01-15 10:30:00

🔍 Checking for trade tie-out tables...
✅ Found existing tables:
   - TRADE_TIE_OUT_RESULTS
   - TRADE_TIE_OUTS

🔍 Checking for sequences...
✅ Found existing sequences:
   - TRADE_TIE_OUT_RESULTS_SEQ
   - TRADE_TIE_OUTS_SEQ

🔍 Checking for views...
✅ Found existing views:
   - V_TRADE_DETAILS
   - V_TRADE_TIE_OUT_SUMMARY

🎉 Database connection test completed successfully!
🔌 Connection closed
```

### 2. Test Backend API

Start the backend server:

```bash
cd backend
npm run dev
```

Test the API endpoints:

```bash
# Get trade tie-out summaries
curl http://localhost:5000/api/trade-tieouts

# Create a new trade tie-out (POST request with JSON body)
curl -X POST http://localhost:5000/api/trade-tieouts \
  -H "Content-Type: application/json" \
  -d '{
    "tradeDate": "2024-01-15",
    "sideAFileName": "trader_records.xlsx",
    "sideBFileName": "risk_records.xlsx",
    "userName": "john.doe",
    "keyMatrix": {"Trade ID": "Trade ID", "Product": "Commodity"},
    "results": [
      {
        "tradeId": "TRADE-001",
        "product": "Crude Oil",
        "volume": "1000 barrels",
        "price": "$85.50",
        "counterparty": "Shell Trading",
        "internalCompany": "Exodus Energy",
        "status": "matched",
        "userName": "john.doe"
      }
    ]
  }'
```

## Frontend Integration

### 1. Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Test the Frontend

Start the frontend development server:

```bash
cd frontend
npm run dev
```

Navigate to the Trading page and test the import functionality.

## Development vs Production

### Development Mode
- Set `NODE_ENV=development` in your `.env` file
- The backend will use mock data instead of connecting to the database
- Useful for frontend development without database setup

### Production Mode
- Set `NODE_ENV=production` in your `.env` file
- The backend will connect to the Oracle database
- All data will be persisted in the database

## API Endpoints

### POST /api/trade-tieouts
Create a new trade tie-out session with results.

**Request Body:**
```json
{
  "tradeDate": "2024-01-15",
  "sideAFileName": "trader_records.xlsx",
  "sideBFileName": "risk_records.xlsx",
  "userName": "john.doe",
  "keyMatrix": {"Trade ID": "Trade ID", "Product": "Commodity"},
  "results": [
    {
      "tradeId": "TRADE-001",
      "product": "Crude Oil",
      "volume": "1000 barrels",
      "price": "$85.50",
      "counterparty": "Shell Trading",
      "internalCompany": "Exodus Energy",
      "status": "matched",
      "userName": "john.doe"
    }
  ]
}
```

### GET /api/trade-tieouts
Get all trade tie-out summaries with statistics.

### GET /api/trade-tieouts/:tradeDate/details
Get detailed trade information for a specific date.

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Verify the database host, port, and service name
   - Check if the Oracle database is running
   - Ensure network connectivity

2. **Authentication Failed**
   - Verify username and password
   - Check if the user has necessary permissions

3. **Tables Not Found**
   - Run the `oracle_tables.sql` script
   - Check if you're connected to the correct schema

4. **Permission Denied**
   - Ensure the database user has CREATE, INSERT, UPDATE, DELETE permissions
   - Grant necessary privileges to the user

### Debug Mode

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed database connection and query information.

## Database Schema

### TRADE_TIE_OUTS Table
- `TRADE_TIE_OUT_ID`: Primary key (auto-generated)
- `TRADE_DATE`: Date of the trades being compared
- `SIDE_A_FILE_IMPORT`: Content of trader records file
- `SIDE_A_FILE_NAME`: Original filename of trader records
- `SIDE_B_FILE_IMPORT`: Content of risk management records file
- `SIDE_B_FILE_NAME`: Original filename of risk management records
- `USER_NAME`: Username who performed the tie-out
- `SYSTEM_TIMESTAMP`: When the tie-out was performed
- `KEY_MATRIX`: JSON mapping of column names
- `CREATED_DATE`: Record creation timestamp
- `MODIFIED_DATE`: Record modification timestamp

### TRADE_TIE_OUT_RESULTS Table
- `TRADE_TIE_OUT_RESULT_ID`: Primary key (auto-generated)
- `TTO_TRADE_TIE_OUT_ID`: Foreign key to parent table
- `TRADE_ID`: Unique identifier for the trade
- `PRODUCT`: Commodity or product being traded
- `VOLUME`: Quantity and units of the trade
- `PRICE`: Price per unit of the trade
- `COUNTERPARTY`: External trading partner
- `INTERNAL_COMPANY`: Internal company identifier
- `STATUS`: Comparison status (matched, discrepancy, pending)
- `USER_NAME`: Username who processed this result
- `SYSTEM_DATE`: When this result was processed
- `CREATED_DATE`: Record creation timestamp
- `MODIFIED_DATE`: Record modification timestamp

## Performance Considerations

1. **Indexes**: The script creates indexes on frequently queried columns
2. **Connection Pooling**: Configured for optimal performance
3. **Batch Operations**: Use batch inserts for large datasets
4. **Query Optimization**: Use the provided views for complex queries

## Security

1. **Environment Variables**: Never commit database credentials to version control
2. **Input Validation**: All inputs are validated on both frontend and backend
3. **SQL Injection**: Using parameterized queries to prevent SQL injection
4. **Access Control**: Implement proper authentication and authorization

## Support

If you encounter issues:

1. Check the logs for detailed error messages
2. Verify database connectivity using the test script
3. Ensure all environment variables are correctly set
4. Check database permissions and schema access 