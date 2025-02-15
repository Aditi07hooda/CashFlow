import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./userModel.js";

const Notes = sequelize.define("Notes", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  note: {
    type: DataTypes.STRING,
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

Notes.belongsTo(User, { foreignKey: "user_id" });

export default Notes;