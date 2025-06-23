'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id_user: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
      },
      username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
      },
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
      },
      password: Sequelize.STRING,
      address: Sequelize.STRING,
      phone_number: Sequelize.STRING,
      role: {
      type: Sequelize.ENUM('admin', 'user'),
      defaultValue: 'user',
      allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};