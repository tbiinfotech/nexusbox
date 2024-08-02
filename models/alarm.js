"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Alarm = sequelize.define(
  "Alarm",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    audioFilename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alarmName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Alarms",
    timestamps: true,
  }
);

module.exports = Alarm;

