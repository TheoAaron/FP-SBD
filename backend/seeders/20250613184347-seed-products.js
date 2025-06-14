'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    await queryInterface.bulkInsert('products', [
      {
        id_produk: uuidv4(),
        nama_produk: 'iPhone 15 Pro',
        avg_rating: 4.7,
        harga: 17990000,
        description: 'Smartphone flagship dengan chip A17 Pro dan kamera canggih.',
        image: 'iphone15pro.jpg',
        stock: 25,
        total_review: 120,
        kategori: 'phone',
        createdAt: now,
        updatedAt: now
      },
      {
        id_produk: uuidv4(),
        nama_produk: 'PlayStation 5',
        avg_rating: 4.9,
        harga: 8490000,
        description: 'Konsol generasi terbaru dari Sony dengan performa tinggi.',
        image: 'ps5.jpg',
        stock: 40,
        total_review: 250,
        kategori: 'gaming',
        createdAt: now,
        updatedAt: now
      },
      {
        id_produk: uuidv4(),
        nama_produk: 'MacBook Pro M3',
        avg_rating: 4.8,
        harga: 31999000,
        description: 'Laptop profesional dengan chip Apple M3 dan layar Retina.',
        image: 'macbookpro.jpg',
        stock: 10,
        total_review: 85,
        kategori: 'computer',
        createdAt: now,
        updatedAt: now
      },
      {
        id_produk: uuidv4(),
        nama_produk: 'Sony WH-1000XM5',
        avg_rating: 4.6,
        harga: 4990000,
        description: 'Headphone noise cancelling terbaik dari Sony.',
        image: 'sonywh1000xm5.jpg',
        stock: 30,
        total_review: 180,
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
