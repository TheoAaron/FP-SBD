const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Coupon = sequelize.define('Coupon', {
  id_kupon: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  kode_kupon: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  expire_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'used'),
    allowNull: false,
    defaultValue: 'active'
  },
  diskon: {
    type: DataTypes.FLOAT(3, 2),
    allowNull: false
  }
}, {
  tableName: 'coupons',
  timestamps: true
});

module.exports = Coupon;
