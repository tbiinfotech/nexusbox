"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    roleId: {
      type: DataTypes.INTEGER,
    },
    phone: {
      type: DataTypes.STRING,
    },
    company: {
      type: DataTypes.STRING,
    },

    fcmToken: { 
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "Users",
  }
);

module.exports = User;
