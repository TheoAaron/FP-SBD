const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const users = await queryInterface.sequelize.query(
      `SELECT id_user FROM users LIMIT 3;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const shipments = await queryInterface.sequelize.query(
      `SELECT id_shipment, id_user FROM shipment_details LIMIT 3;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const coupons = await queryInterface.sequelize.query(
      `SELECT id_kupon FROM coupons WHERE status = 'active' LIMIT 3;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0 || shipments.length === 0) {
      throw new Error('Seeder gagal: Data user atau shipment belum tersedia.');
    }

    const orders = shipments.map((shipment, index) => {
      const user = users.find(u => u.id_user === shipment.id_user) || users[0];
      const coupon = coupons[index] || null;

      return {
        id_order: uuidv4(),
        id_user: user.id_user,
        id_kupon: coupon ? coupon.id_kupon : null,
        id_shipment: shipment.id_shipment,
        status_pembayaran: index % 2 === 0 ? 'paid' : 'pending',
        status_pengiriman: index % 2 === 0 ? 'delivered' : 'shipped',
        metode_pembayaran: index % 2 === 0 ? 'transfer bank' : 'cod',
        total: 250000 + (index * 50000),
        datetime: new Date(),
        no_resi: index % 2 === 0 ? `RESI123${index}` : null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    await queryInterface.bulkInsert('orders', orders);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('orders', null, {});
  }
};

