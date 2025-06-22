const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setMonth(now.getMonth() + 1);

    const coupons = [
      {
        id_kupon: uuidv4(),
        kode_kupon: 'DISKON10',
        expired_at: futureDate,
        status: 'active',
        diskon: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_kupon: uuidv4(),
        kode_kupon: 'DISKON20',
        expired_at: futureDate,
        status: 'active',
        diskon: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_kupon: uuidv4(),
        kode_kupon: 'EXPIRED5',
        expired_at: new Date('2024-12-01'),
        status: 'expired',
        diskon: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_kupon: uuidv4(),
        kode_kupon: 'USED15',
        expired_at: futureDate,
        status: 'expired',
        diskon: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('coupons', coupons);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('coupons', null, {});
  }
};
