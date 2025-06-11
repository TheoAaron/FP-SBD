'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('coupons', {
      id_kupon: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      kode_kupon: {
        type: Sequelize.STRING,
        unique: true
      },
      diskon: Sequelize.FLOAT(10, 2),
      expired_at: Sequelize.DATE,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('coupons');
  }
};
