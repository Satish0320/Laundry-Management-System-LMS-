// db.js (improved diagnostics)
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'laundry_db',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('MySQL pool connected. Server version check:');
    const [rows] = await conn.query('SELECT VERSION() AS version');
    console.log('MySQL version:', rows[0].version);
    conn.release();
  } catch (err) {
    console.error('Failed to connect to MySQL from db.js. Please check your .env and MySQL server.');
    console.error('Connection error:', err.code, err.message);
  }
})();

module.exports = pool;
