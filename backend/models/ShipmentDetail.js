const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/mysql');

const ShipmentDetail = sequelize.define('ShipmentDetail', {
  id_shipment: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  id_user: {
    type: DataTypes.UUID,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  street_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kota: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kode_pos: {
    type: DataTypes.STRING,
    allowNull: false
  },
  no_telepon: {
    type: DataTypes.STRING,
    allowNull: false
  },
  negara: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'shipment_details',
  timestamps: true
});

module.exports = ShipmentDetail;
