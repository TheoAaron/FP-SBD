const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config();

// Fungsi hash password pakai SHA-256
function hashPassword(password) {
  const salt = process.env.PASSWORD_SALT || 'defaultsalt';
  if (!process.env.PASSWORD_SALT) {
    console.warn('WARNING: PASSWORD_SALT not found in environment variables, using default salt');
  }
  return crypto.createHash('sha256').update(`${password}${salt}`).digest('hex');
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        id_user: uuidv4(),
        username: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        password: hashPassword('admin123'),
        address: 'Admin Street 123',
        phone_number: '08123456789',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_user: uuidv4(),
        username: 'john_doe',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: hashPassword('password1'),
        address: 'Jl. Mawar No.1',
        phone_number: '08123456780',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_user: uuidv4(),
        username: 'jane_doe',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        password: hashPassword('password2'),
        address: 'Jl. Melati No.2',
        phone_number: '08123456781',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return queryInterface.bulkInsert('users', users);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
