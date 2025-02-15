import { Sequelize } from "sequelize";

const sequelize = new Sequelize("MoneyManager", "postgres", "071003", {
  host: "localhost",
  dialect: "postgres",
  port: "5432",
  logging: true,
});

export default sequelize;
