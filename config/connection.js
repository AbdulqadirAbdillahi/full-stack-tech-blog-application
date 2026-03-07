require("dotenv").config();
const { Sequelize } = require("sequelize");

// Use DATABASE_URL if on Render (external DB URL)
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: process.env.DB_PORT || 5432,
        logging: false,
      }
    );

module.exports = sequelize;