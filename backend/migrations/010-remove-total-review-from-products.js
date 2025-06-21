'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Check if column exists first
      const tableDescription = await queryInterface.describeTable('products');
      if (tableDescription.total_review) {
        // Remove total_review column from products table
        await queryInterface.removeColumn('products', 'total_review');
        console.log('✅ Removed total_review column from products table');
      } else {
        console.log('ℹ️  total_review column does not exist, skipping removal');
      }
    } catch (error) {
      console.log('ℹ️  total_review column removal skipped:', error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // Add back total_review column if rollback is needed
    await queryInterface.addColumn('products', 'total_review', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
  }
};
