import { Sequelize } from "sequelize";
import pkg from "pg"; // Explicitly import pg
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg; // Ensure pg is available

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  dialectModule: pkg, // Manually specify pg module
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // For NeonDB
    },
  },
});

export default sequelize;