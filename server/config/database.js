// server/config/database.js

import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST || mysql.railway.internal,
  user: process.env.DB_USER || root,
  password: process.env.DB_PASSWORD || javis,
  database: process.env.DB_NAME || javis_auth,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database (MySQL) terhubung!');
    connection.release();
  } catch (err) {
    console.error('Gagal terhubung ke database:', err);
  }
})();

export default pool;