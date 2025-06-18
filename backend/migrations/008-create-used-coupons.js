'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('used_coupons', {
      id_used_coupon: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('(UUID())'),
        primaryKey: true,
        allowNull: false,        
      },
      id_user: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id_user'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_kupon: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'coupons',
          key: 'id_kupon'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      used_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    // Tambahkan constraint unik kombinasi id_user dan id_kupon
    await queryInterface.addConstraint('used_coupons', {
      fields: ['id_user', 'id_kupon'],
      type: 'unique',
      name: 'unique_user_kupon'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('used_coupons');
  }
};
