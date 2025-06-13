const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = [
      {
        id_produk: uuidv4(),
        nama_produk: 'Mouse Gaming RGB',
        avg_rating: 4.5,
        harga: 150000.00,
        description: 'Mouse gaming dengan pencahayaan RGB dan DPI hingga 6400.',
        image: 'mouse-gaming.jpg',
        stock: 50,
        total_review: 12,
        kategori: 'Elektronik',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_produk: uuidv4(),
        nama_produk: 'Kemeja Linen Pria',
        avg_rating: 4.2,
        harga: 120000.00,
        description: 'Kemeja pria bahan linen premium, cocok untuk acara formal maupun santai.',
        image: 'kemeja-linen.jpg',
        stock: 100,
        total_review: 8,
        kategori: 'Pakaian',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_produk: uuidv4(),
        nama_produk: 'Tumbler Stainless 500ml',
        avg_rating: 4.7,
        harga: 60000.00,
        description: 'Tumbler stainless steel, tahan panas dan dingin, cocok untuk dibawa bepergian.',
        image: 'tumbler.jpg',
        stock: 75,
        total_review: 22,
        kategori: 'Aksesoris',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('products', products);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
