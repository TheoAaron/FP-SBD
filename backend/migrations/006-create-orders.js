'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id_order: {
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
      id_kupon: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'coupons',
          key: 'id_kupon'
        },
        onDelete: 'SET NULL'
      },
      id_shipment: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'shipment_details',
          key: 'id_shipment'
        },
        onDelete: 'CASCADE'
      },
      status_pembayaran: {
        type: Sequelize.ENUM('pending', 'paid'),
        defaultValue: 'pending'
      },
      status_pengiriman: {
        type: Sequelize.ENUM('shipped', 'delivered'),
        defaultValue: 'shipped'
      },
      metode_pembayaran: Sequelize.STRING,
      total: Sequelize.FLOAT(10, 2),
      datetime: Sequelize.DATE,
      no_resi: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};