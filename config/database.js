import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: true,
  dialectOptions: {
    ssl: {
      require: true, // Required for Neon database
      rejectUnauthorized: false, // Set to false if using self-signed SSL certificates
    },
  },
});

export default sequelize;