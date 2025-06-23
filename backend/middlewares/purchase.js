const { pool } = require('../config/mysql');

const checkPurchaseHistory = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required',
        redirect: '/home'
      });
    }

    const userId = req.user.id;
    const productId = req.params.id_produk || req.body.productId;

    if (!productId) {
      return res.status(400).json({
        message: 'Product ID is required'
      });
    }

    console.log(`Checking purchase history for user: ${userId}, product: ${productId}`);

    const [rows] = await pool.query(`
      SELECT
        o.id_order,
        o.status_pembayaran,
        o.datetime,
        do.id_produk,
        do.qty
      FROM orders o
      JOIN detail_orders do ON o.id_order = do.id_order
      WHERE o.id_user = ?
        AND do.id_produk = ?
        AND o.status_pengiriman = 'delivered'
    `, [userId, productId]);

    req.purchaseHistory = {
      hasPurchased: rows.length > 0,
      totalPurchases: rows.length,
      purchases: rows
    };

    console.log(`Purchase history result:`, req.purchaseHistory);

    next();
  } catch (err) {
    console.error('Error checking purchase history:', err);
    res.status(500).json({ message: 'Server error while checking purchase history' });
  }
};

    const requirePurchase = async (req, res, next) => {
  try {

    await new Promise((resolve, reject) => {
      checkPurchaseHistory(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.purchaseHistory.hasPurchased) {
      return res.status(403).json({
        message: 'You must purchase this product before performing this action',
        redirect: `/product/${req.params.productId || req.body.productId}`
      });
    }

    next();
  } catch (err) {
    console.error('Error in requirePurchase middleware:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  checkPurchaseHistory,
  requirePurchase
};
