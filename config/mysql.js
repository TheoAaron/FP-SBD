const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  }
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected");
  } catch (error) {
    console.error("❌ Unable to connect to MySQL:", error);
  }
};

module.exports = { sequelize, connectMySQL };
