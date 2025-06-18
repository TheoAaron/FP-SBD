const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const connectMySQL = async () => {
  try {
    await pool.getConnection();
    console.log("✅ MySQL connected");
  } catch (error) {
    console.error("❌ Unable to connect to MySQL:", error);
  }
}

module.exports = {  pool, connectMySQL };
