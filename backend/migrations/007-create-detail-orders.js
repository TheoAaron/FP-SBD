'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('detail_orders', {
      id_detail_order: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      id_order: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id_order'
        },
        onDelete: 'CASCADE'
      },
      id_produk: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id_produk'
        },
        onDelete: 'CASCADE'
      },
      qty: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('detail_orders');
  }
};