// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'sbdjaya',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '123',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql', // atau 'postgres' jika kamu pakai PostgreSQL
    port: process.env.DB_PORT || 3306,
    logging: false, // ubah ke true jika ingin melihat log query
    define: {
      freezeTableName: true, // tabel tidak akan dijamakkan otomatis
    }
  }
);

module.exports = sequelize;
