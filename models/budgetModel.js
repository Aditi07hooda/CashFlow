import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.model.js";
import Category from "./category.model.js";

const Budget = sequelize.define("Budget", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  budget: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  period: {
    type: DataTypes.ENUM("DAILY", "WEEKLY", "MONTHLY", "CUSTOM"),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Budget.belongsTo(User, { foreignKey: "user_id" });
Budget.belongsToMany(Category, { through: "budget_categories" });

export default Budget;