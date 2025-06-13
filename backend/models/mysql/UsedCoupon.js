const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql'); 

const UsedCoupon = sequelize.define('UsedCoupon', {
  id_used_coupon: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  id_user: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
        model: 'users',
        key: 'id_user'
    }
  },
  id_kupon: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
        model: 'coupons',
        key: 'id_kupon'
    }
  },
  used_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'used_coupons',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['id_user', 'id_kupon']
    }
  ]
});

module.exports = UsedCoupon;