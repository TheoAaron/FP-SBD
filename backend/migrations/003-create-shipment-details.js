'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('shipment_details', {
      id_shipment: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      id_user: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id_user'
        },
        onDelete: 'CASCADE'
      },
      first_name: Sequelize.STRING,
      street_address: Sequelize.STRING,
      kota: Sequelize.STRING,
      kode_pos: Sequelize.STRING,
      no_telepon: Sequelize.STRING,
      negara: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('shipment_details');
  }
};