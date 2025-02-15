import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./userModel.js";
import Category from "./categoryModel.js";

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING,
  },
  transactionType: {
    type: DataTypes.ENUM("INCOME", "EXPENSE"),
    allowNull: false,
  },
  accountType: {
    type: DataTypes.ENUM("CASH", "CARD", "UPI"),
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
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

Transaction.belongsTo(User, { foreignKey: "user_id" });
Transaction.belongsTo(Category, { foreignKey: "category_id" });

export default Transaction;