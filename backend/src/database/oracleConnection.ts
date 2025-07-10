import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  poolMin: 1,
  poolMax: 1,
  poolIncrement: 0
};

let pool: oracledb.Pool | null = null;

export async function getOracleConnection(): Promise<oracledb.Connection> {
  if (!pool) {
    pool = await oracledb.createPool(dbConfig);
  }
  return await pool.getConnection();
}

export async function closeOraclePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

// If run directly, test the connection
if (require.main === module) {
  (async () => {
    try {
      console.log('Testing Oracle DB connection...');
      const conn = await getOracleConnection();
      const result = await conn.execute('SELECT SYSDATE FROM DUAL');
      const dbTime = (result.rows && result.rows[0] && (result.rows[0] as any[])[0]) || 'Unknown';
      console.log('Connection successful! Current DB time:', dbTime);
      await conn.close();
      await closeOraclePool();
      console.log('Connection closed.');
    } catch (err) {
      console.error('Connection failed:', err);
      process.exit(1);
    }
  })();
} 