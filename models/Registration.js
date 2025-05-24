import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";
import Schedule from "./Schedule.js";
import User from "./User.js";

const Registration = sequelize.define(
  "Registration",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    donor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("verified", "completed", "no_show"),
      allowNull: false,
      defaultValue: "verified",
    },
  },
  {
    tableName: "registrations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Registration.belongsTo(User, {
  foreignKey: "donor_id",
});
Registration.belongsTo(Schedule, {
  foreignKey: "schedule_id",
});

export default Registration;
