const { UUIDV4 } = require('sequelize');
const { pool } = require('../config/mysql');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');


const JWT_SECRET = process.env.JWT_SECRET || 'APINGANTENG';

async function createOrder(req, res) {
    console.log('Received request to create order');
  try {
    console.log('createOrder function called');
    console.log('User from auth middleware:', req.user);
      const { payment_details, order_details} = req.body;
    const { kode_kupon, id_shipment, metode_pembayaran } = req.body;
    
    let status_pembayaran = 'paid';
    if (metode_pembayaran === 'cod') {
        status_pembayaran = 'pending';}

    let status_pengiriman = 'delivered';
    if (metode_pembayaran === 'cod') {
        status_pengiriman = 'shipped';}
    
    // Query coupon if kode_kupon is provided
    let id_kupon = null;
    if (kode_kupon) {
      const [couponRows] = await pool.query('SELECT id_kupon FROM coupons WHERE kode_kupon = ?', [kode_kupon]);
      if (couponRows.length > 0) {
        id_kupon = couponRows[0].id_kupon;
        console.log('Coupon found:', id_kupon);
      } else {
        console.log('Coupon not found:', kode_kupon);
      }
    }

    // Validate that we have an authenticated user
    if (!req.user || !req.user.id) {
      console.log('Authentication issue: req.user not properly set');
      return res.status(401).json({ message: "Authentication required - user ID not found in token" });
    }
    
    // Validate required fields
    if (!payment_details || !order_details) {
      return res.status(400).json({ message: "Missing required order information" });
    }
    
    // Use the user ID from the token instead of requiring it in the body
    const userId = req.user.id;
    console.log('Using user ID from token:', userId);
    
    if (!Array.isArray(order_details) || order_details.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one product" });
    }    const orderId = `order_${Date.now()}`;

    // Use userId from auth token instead of from request body
    await pool  .query(
      'INSERT INTO orders ( id_order, id_user, id_kupon, id_shipment, status_pembayaran, status_pengiriman, metode_pembayaran, total, datetime, no_resi', 
      [uuidv4(), userId, id_kupon, id_shipment, status_pembayaran,, new Date()]
    );

    for (const item of order_details) {
      const { product_id, quantity, price } = item;
      await pool.query(
        'INSERT INTO detail_orders (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', 
        [orderId, product_id, quantity, price]
      );
    }

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
async function postAllOrders(req, res) {
  try {
    const { userId, products } = req.body;

    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const orderId = `order_${Date.now()}`;

    await pool.query('INSERT INTO orders (id_user, status, created_at) VALUES ( ?, ?, ?)', [orderId, userId, 'pending', new Date()]);

    for (const product of products) {
      const { productId, quantity } = product;
      await pool.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)', [orderId, productId, quantity]);
    }

    res.status(201).json({ message: "Order placed successfully", orderId });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { createOrder, postAllOrders };