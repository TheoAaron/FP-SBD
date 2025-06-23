'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    await queryInterface.bulkInsert('products', [      {
        id_produk: uuidv4(),
        nama_produk: 'iPhone 15 Pro',
        harga: 17990000,
        description: 'Smartphone flagship dengan chip A17 Pro dan kamera canggih.',
        image: 'https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-hero-230912_Full-Bleed-Image.jpg.xlarge.jpg',
        stock: 25,
        kategori: 'phone',
        createdAt: now,
        updatedAt: now
      },
      {
        id_produk: uuidv4(),
        nama_produk: 'PlayStation 5',
        harga: 8490000,
        description: 'Konsol generasi terbaru dari Sony dengan performa tinggi.',
        image: 'https://akcdn.detik.net.id/visual/2024/09/11/playstation-5-pro_169.jpeg?w=900&q=80',
        stock: 40,
        kategori: 'gaming',
        createdAt: now,
        updatedAt: now
      },
      {
        id_produk: uuidv4(),
        nama_produk: 'MacBook Pro M3',
        harga: 31999000,
        description: 'Laptop profesional dengan chip Apple M3 dan layar Retina.',
        image: 'macbookpro.jpg',
        stock: 10,
        kategori: 'computer',
        createdAt: now,
        updatedAt: now
      },
      {
        id_produk: uuidv4(),
        nama_produk: 'Sony WH-1000XM5',
       
        harga: 4990000,
        description: 'Headphone noise cancelling terbaik dari Sony.',        image: 'sonywh1000xm5.jpg',
        stock: 30,
        kategori: 'audio',
        createdAt: now,
        updatedAt: now
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
