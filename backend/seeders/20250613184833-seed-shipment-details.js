const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ambil user dari DB
    const users = await queryInterface.sequelize.query(
      `SELECT id_user, first_name FROM users LIMIT 3;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users || users.length === 0) {
      throw new Error('Seeder gagal: Tidak ada user ditemukan. Jalankan seeder user terlebih dahulu.');
    }

    const shipments = users.map((user, index) => ({
      id_shipment: uuidv4(),
      id_user: user.id_user,
      first_name: user.first_name,
      street_address: `Jalan Contoh No.${index + 1}`,
      kota: 'Jakarta',
      kode_pos: `10${index}00`,
      no_telepon: `0812345678${index}`,
      negara: 'Indonesia',
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('shipment_details', shipments);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('shipment_details', null, {});
  }
};
