const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const users = await queryInterface.sequelize.query(
      `SELECT id_user FROM users LIMIT 3;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const coupons = await queryInterface.sequelize.query(
      `SELECT id_kupon FROM coupons WHERE status = 'active' LIMIT 3;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length || !coupons.length) {
      throw new Error('Seeder gagal: Pastikan ada user dan kupon aktif.');
    }

    const usedCoupons = [];

    users.forEach((user, i) => {
      const coupon = coupons[i % coupons.length];
      usedCoupons.push({
        id_used_coupon: uuidv4(),
        id_user: user.id_user,
        id_kupon: coupon.id_kupon,
        used_at: new Date()
      });
    });

    await queryInterface.bulkInsert('used_coupons', usedCoupons);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('used_coupons', null, {});
  }
};

