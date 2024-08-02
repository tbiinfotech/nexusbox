const sequelize = require('../db/db');
const User = require('./user');
const Task = require('./task');
const DeveloperAssignment = require('./userAssignment');

// Define associations
User.hasMany(Task, { foreignKey: 'clientId' });
User.hasMany(Task, { foreignKey: 'developerId' });
User.hasMany(Task, { foreignKey: 'projectManagerId' });
User.hasMany(Task, { foreignKey: 'serverId' });

Task.belongsTo(User, { as: 'Client', foreignKey: 'clientId' });
Task.belongsTo(User, { as: 'Developer', foreignKey: 'developerId' });
Task.belongsTo(User, { as: 'ProjectManager', foreignKey: 'projectManagerId' });
Task.belongsTo(User, { as: 'Server', foreignKey: 'serverId' });


User.hasMany(DeveloperAssignment, { foreignKey: 'developerId' });
User.hasMany(DeveloperAssignment, { foreignKey: 'projectManagerId' });
User.hasMany(DeveloperAssignment, { foreignKey: 'serverStaffId' });

DeveloperAssignment.belongsTo(User, {as: 'Developer',  foreignKey: 'developerId' });
DeveloperAssignment.belongsTo(User, {as: 'ProjectManager', foreignKey: 'projectManagerId' });
DeveloperAssignment.belongsTo(User, {as: 'ServerStaff', foreignKey: 'serverStaffId' });

module.exports = {
  sequelize,
  User,
  Task,
  DeveloperAssignment
};
