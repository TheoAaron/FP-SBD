const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/mysql');

const DetailOrder = sequelize.define('DetailOrder', {
  id_detail_order: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  id_order: {
    type: DataTypes.UUID,
    allowNull: false
  },
  id_produk: {
    type: DataTypes.UUID,
    allowNull: false
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'detail_orders',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['id_order', 'id_produk']
    }
  ]
});

module.exports = DetailOrder;