'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id_produk: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      nama_produk: Sequelize.STRING,
      avg_rating: {
        type: Sequelize.FLOAT(10, 2),
        defaultValue: 0.00
      },
      harga: Sequelize.FLOAT(10, 2),
      description: Sequelize.TEXT,
      image: Sequelize.STRING,
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_review: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      kategori: {
        type: Sequelize.ENUM('phone', 'computer', 'gaming', 'watch', 'camera', 'audio'),
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
};
