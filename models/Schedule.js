import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";
import User from "./User.js";

const Schedule = sequelize.define(
  "Schedule",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pmi_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    quota: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    remaining_quota: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("available", "full", "cancelled"),
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "schedules",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Schedule.belongsTo(User, {
  foreignKey: "pmi_id",
  as: "pmi",
});

export default Schedule;
