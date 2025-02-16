import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres", // Ensure dialect is correct
  logging: true,
  dialectOptions: {
    ssl: {
      require: true, // Required for NeonDB
      rejectUnauthorized: false, // Set to false for self-signed SSL
    },
  },
});

export default sequelize;