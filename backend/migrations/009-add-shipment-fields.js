'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add missing columns to shipment_details table
    await queryInterface.addColumn('shipment_details', 'last_name', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('shipment_details', 'apartment_floor', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('shipment_details', 'label', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('shipment_details', 'email_address', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the added columns
    await queryInterface.removeColumn('shipment_details', 'last_name');
    await queryInterface.removeColumn('shipment_details', 'apartment_floor');
    await queryInterface.removeColumn('shipment_details', 'label');
    await queryInterface.removeColumn('shipment_details', 'email_address');
  }
};
