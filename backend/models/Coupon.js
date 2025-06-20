const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/mysql');

const Coupon = sequelize.define('Coupon', {
  id_kupon: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },  kode_kupon: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  expired_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'expired'),
    allowNull: false,
    defaultValue: 'active'
  },
  diskon: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false
  }
}, {
  tableName: 'coupons',
  timestamps: true
});

module.exports = Coupon;
