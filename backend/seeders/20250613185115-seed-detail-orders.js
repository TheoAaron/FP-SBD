const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ambil data orders dan products
    const orders = await queryInterface.sequelize.query(
      `SELECT id_order FROM orders LIMIT 5;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const products = await queryInterface.sequelize.query(
      `SELECT id_produk FROM products LIMIT 5;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (orders.length === 0 || products.length === 0) {
      throw new Error('Seeder gagal: Data order atau produk belum tersedia.');
    }

    const detailOrders = [];

    // Hubungkan tiap order dengan 2 produk unik
    orders.forEach((order, i) => {
      const firstProduct = products[i % products.length];
      const secondProduct = products[(i + 1) % products.length];

      detailOrders.push({
        id_detail_order: uuidv4(),
        id_order: order.id_order,
        id_produk: firstProduct.id_produk,
        qty: 1 + (i % 3),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      detailOrders.push({
        id_detail_order: uuidv4(),
        id_order: order.id_order,
        id_produk: secondProduct.id_produk,
        qty: 1 + ((i + 1) % 3),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    await queryInterface.bulkInsert('detail_orders', detailOrders);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('detail_orders', null, {});
  }
};
