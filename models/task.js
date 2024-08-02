"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");
const User = require("./user"); // Import User model

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    developerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    projectManagerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    serverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    tableName: "Tasks",
  }
);

// Define associations
Task.belongsTo(User, { as: "Client", foreignKey: "clientId" });
Task.belongsTo(User, { as: "Developer", foreignKey: "developerId" });
Task.belongsTo(User, { as: "ProjectManager", foreignKey: "projectManagerId" });
Task.belongsTo(User, { as: "Server", foreignKey: "serverId" });

module.exports = Task;
