"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Roles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    });

    // Insert predefined roles
    await queryInterface.bulkInsert("Roles", [
      { id: 1, name: "superadmin" },
      { id: 2, name: "developer" },
      { id: 3, name: "client" },
      { id: 4, name: "projectmanager" },
      { id: 5, name: "server" },
      { id: 6, name: "user" },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Roles");
  },
};
