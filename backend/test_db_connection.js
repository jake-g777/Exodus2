// Test script to verify Oracle database connection and trade tie-out tables
const oracledb = require('oracledb');

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'zenith_dba',
  password: process.env.DB_PASSWORD || 'ZENITH2023!!',
  connectString: process.env.DB_CONNECT_STRING || '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=db.runescapeproj.com)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=DBRUNESCAPEPROJ)))',
  poolMin: 1,
  poolMax: 1,
  poolIncrement: 0
};

async function testConnection() {
  let connection;
  
  try {
    console.log('🔌 Testing Oracle database connection...');
    
    // Create connection
    connection = await oracledb.getConnection(dbConfig);
    console.log('✅ Database connection successful!');
    
    // Test basic query
    const result = await connection.execute('SELECT SYSDATE FROM DUAL');
    console.log('📅 Current database time:', result.rows[0][0]);
    
    // Check if trade tie-out tables exist
    console.log('\n🔍 Checking for trade tie-out tables...');
    
    const tableCheck = await connection.execute(`
      SELECT table_name 
      FROM user_tables 
      WHERE table_name IN ('TRADE_TIE_OUTS', 'TRADE_TIE_OUT_RESULTS')
      ORDER BY table_name
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Found existing tables:');
      tableCheck.rows.forEach(row => console.log(`   - ${row[0]}`));
    } else {
      console.log('❌ Trade tie-out tables not found');
      console.log('💡 Run the oracle_tables.sql script to create the tables');
    }
    
    // Check if sequences exist
    console.log('\n🔍 Checking for sequences...');
    
    const seqCheck = await connection.execute(`
      SELECT sequence_name 
      FROM user_sequences 
      WHERE sequence_name IN ('TRADE_TIE_OUTS_SEQ', 'TRADE_TIE_OUT_RESULTS_SEQ')
      ORDER BY sequence_name
    `);
    
    if (seqCheck.rows.length > 0) {
      console.log('✅ Found existing sequences:');
      seqCheck.rows.forEach(row => console.log(`   - ${row[0]}`));
    } else {
      console.log('❌ Sequences not found');
    }
    
    // Check if views exist
    console.log('\n🔍 Checking for views...');
    
    const viewCheck = await connection.execute(`
      SELECT view_name 
      FROM user_views 
      WHERE view_name IN ('V_TRADE_TIE_OUT_SUMMARY', 'V_TRADE_DETAILS')
      ORDER BY view_name
    `);
    
    if (viewCheck.rows.length > 0) {
      console.log('✅ Found existing views:');
      viewCheck.rows.forEach(row => console.log(`   - ${row[0]}`));
    } else {
      console.log('❌ Views not found');
    }
    
    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('🔌 Connection closed');
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

// Run the test
testConnection().catch(console.error); 