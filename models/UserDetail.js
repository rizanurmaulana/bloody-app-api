import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";
import User from "./User.js";

const UserDetail = sequelize.define(
  "UserDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.ENUM("L", "P"),
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    blood_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    last_donation_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    total_donations: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "user_detail",
    timestamps: false,
  }
);

UserDetail.belongsTo(User, { foreignKey: "user_id" });
User.hasOne(UserDetail, { foreignKey: "user_id" });

export default UserDetail;
