const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'Roles',
  timestamps: false
});

module.exports = Role;
