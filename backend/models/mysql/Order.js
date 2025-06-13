const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/mysql');
const { uniq } = require('lodash');

const Order = sequelize.define('Order', {
  id_order: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  id_user: {
    type: DataTypes.UUID,
    allowNull: false
  },
  id_kupon: {
    type: DataTypes.UUID,
    allowNull: true 
  },
  id_shipment: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true 
  },
  status_pembayaran: {
    type: DataTypes.ENUM('pending', 'paid'),
    allowNull: false,
    defaultValue: 'pending'
  },
  status_pengiriman: {
    type: DataTypes.ENUM('shipped', 'delivered'),
    allowNull: false,
    defaultValue: 'shipped'
  },
  metode_pembayaran: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  no_resi: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true
});

module.exports = Order;
