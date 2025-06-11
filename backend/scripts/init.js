const { execSync } = require('child_process');
const mysql = require('mysql2/promise');
const path = require('path');

// Ambil config CLI
const dbConfig = require('../config/config').development;

async function init() {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.username,
    password: dbConfig.password
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
  console.log(`✅ Database '${dbConfig.database}' is ready.`);
  await connection.end();

  const configPath = path.resolve(__dirname, '../config/config.js');
  const migrationsPath = path.resolve(__dirname, '../migrations');

  execSync(`npx sequelize-cli db:migrate --config "${configPath}" --migrations-path "${migrationsPath}"`, {
    stdio: 'inherit'
  });

  console.log(`✅ Migration completed.`);
}

init().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
