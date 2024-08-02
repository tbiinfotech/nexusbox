"use strict";
const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");
const User = require("./user"); // Import User model

const DeveloperAssignment = sequelize.define(
  "DeveloperAssignment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Ensure userId is not nullable
    },
    developerId: {
      type: DataTypes.INTEGER,
      allowNull: true,

    },
    projectManagerId: {
      type: DataTypes.INTEGER,
      allowNull: true,

    },
    serverStaffId: {
      type: DataTypes.INTEGER,
      allowNull: true,

    },
  },
  {
    timestamps: true,
    tableName: "DeveloperAssignments", // Customize table name if necessary
  }
);

// Define associations
DeveloperAssignment.belongsTo(User, { as: "Developer", foreignKey: "developerId" });
DeveloperAssignment.belongsTo(User, { as: "ProjectManager", foreignKey: "projectManagerId" });
DeveloperAssignment.belongsTo(User, { as: "ServerStaff", foreignKey: "serverStaffId" });

module.exports = DeveloperAssignment;
