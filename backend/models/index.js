const User = require('./User');
const Order = require('./Order');
const ShipmentDetail = require('./ShipmentDetail');
const Coupon = require('./Coupon');
const Product = require('./Product');
const DetailOrder = require('./DetailOrder');
const UsedCoupon = require('./UsedCoupon');

// USER -> ORDER (One to Many)
User.hasMany(Order, { foreignKey: 'id_user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'id_user' });

// USER -> SHIPMENT_DETAIL (One to Many)
User.hasMany(ShipmentDetail, { foreignKey: 'id_user' });
ShipmentDetail.belongsTo(User, { foreignKey: 'id_user' });

// ORDER -> SHIPMENT_DETAIL (One to One via id_shipment in orders)
Order.belongsTo(ShipmentDetail, { foreignKey: 'id_shipment' });
ShipmentDetail.hasOne(Order, { foreignKey: 'id_shipment' });

// ORDER -> DETAIL_ORDER (One to Many)
Order.hasMany(DetailOrder, { foreignKey: 'id_order' });
DetailOrder.belongsTo(Order, { foreignKey: 'id_order' });

// DETAIL_ORDER -> PRODUCT (Many to One)
DetailOrder.belongsTo(Product, { foreignKey: 'id_produk' });
Product.hasMany(DetailOrder, { foreignKey: 'id_produk' }); // opsional

// ORDER -> COUPON (Many Orders can use one Coupon)
Order.belongsTo(Coupon, { foreignKey: 'id_kupon' });
Coupon.hasMany(Order, { foreignKey: 'id_kupon' });

// USED_COUPON junction table between USER and COUPON
UsedCoupon.belongsTo(User, { foreignKey: 'id_user' });
User.hasMany(UsedCoupon, { foreignKey: 'id_user' });

UsedCoupon.belongsTo(Coupon, { foreignKey: 'id_kupon' });
Coupon.hasMany(UsedCoupon, { foreignKey: 'id_kupon' });

module.exports = {
  User,
  Order,
  ShipmentDetail,
  Coupon,
  Product,
  DetailOrder,
  UsedCoupon,
};
