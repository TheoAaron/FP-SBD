const mysql = require('mysql2/promise');

console.log('🔍 Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

// Konfigurasi untuk Railway atau local
const config = {
  host: process.env.RAILWAY_MYSQL_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.RAILWAY_MYSQL_PORT || process.env.DB_PORT || '3307'),
  user: process.env.RAILWAY_MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.RAILWAY_MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.RAILWAY_MYSQL_DATABASE || process.env.DB_NAME || 'sbdjaya',
  // Tambahan config untuk production
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

console.log('🔧 MySQL config:', config);

// Jika ada MYSQL_URL dari Railway, gunakan itu
let pool;
if (process.env.MYSQL_URL) {
  pool = mysql.createPool(process.env.MYSQL_URL);
} else {
  pool = mysql.createPool(config);
}

const connectMySQL = async () => {
  try {
    const connection = await pool.getConnection();
    const host = config.host || 'from URL';
    console.log(`✅ MySQL connected to ${host}`);
    connection.release();
  } catch (error) {
    console.error("❌ Unable to connect to MySQL:", error.message);
    console.log("Current MySQL config:", {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database,
      hasPassword: !!config.password
    });
  }
}

module.exports = {  pool, connectMySQL };
