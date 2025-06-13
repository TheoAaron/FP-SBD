const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');

const Product = sequelize.define('Product', {
  id_produk: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  nama_produk: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avg_rating: {
    type: DataTypes.FLOAT(10, 2),
    defaultValue: 0.00
  },
  harga: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  total_review: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  kategori: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;
