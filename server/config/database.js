const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create Sequelize instance for MariaDB
const sequelize = new Sequelize(
  process.env.DB_NAME || "mcq_exam_system",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "Yash@1943",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mariadb",
    // dialectOptions: {
    //   timezone: "Etc/GMT0",
    // },
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MariaDB database successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
};
