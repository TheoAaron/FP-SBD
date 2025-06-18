const { UUIDV4 } = require('sequelize');
const { pool } = require('../config/mysql');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');


const JWT_SECRET = process.env.JWT_SECRET || 'APINGANTENG';

function generateTrackingNumber() {
  const prefix = 'TRK';
  const randomNumbers = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${randomNumbers}`;
}

async function createOrder(req, res) {
  console.log('Received request to create order');
  try {
    console.log('=== ORDER CREATION DEBUG ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User from auth middleware:', req.user);
    
    const {order_details, kode_kupon, id_shipment, metode_pembayaran, total } = req.body;
    const currentDateTime = new Date();

    if (!order_details || !Array.isArray(order_details) || order_details.length === 0) {
      console.log('ERROR: Invalid order_details');
      return res.status(400).json({ error: 'order_details must be a non-empty array' });
    }
    
    if (!metode_pembayaran) {
      console.log('ERROR: Missing metode_pembayaran');
      return res.status(400).json({ error: 'metode_pembayaran is required' });
    }

    if (!req.user || !req.user.id) {
      console.log('Authentication issue: req.user not properly set');
      return res.status(401).json({ message: "Authentication required - user ID not found in token" });
    }
    
    const userId = req.user.id;
    console.log('Using user ID from token:', userId);
    
    let status_pembayaran = 'paid';
    if (metode_pembayaran === 'cod') {
      status_pembayaran = 'pending';
    }

    let status_pengiriman = 'delivered';
    if (metode_pembayaran === 'cod') {
      status_pengiriman = 'shipped';
    }

    let tracking_number = generateTrackingNumber();
    console.log('Generated tracking number:', tracking_number);    
    let id_kupon = null;
    if (kode_kupon) {
      console.log('Processing coupon:', kode_kupon);
      try {
        const [couponRows] = await pool.query('SELECT id_kupon FROM coupons WHERE kode_kupon = ?', [kode_kupon]);
        if (couponRows.length > 0) {
          id_kupon = couponRows[0].id_kupon;
          console.log('Coupon found:', id_kupon);
        } else {
          console.log('Coupon not found:', kode_kupon);
        }
      } catch (couponError) {
        console.log('Coupon query error:', couponError.message);
      }
    }

    let orderId = uuidv4();
    console.log('Generated order ID:', orderId);

    console.log('Inserting order...');
    console.log('Order values:', [orderId, userId, id_kupon, id_shipment, status_pembayaran, status_pengiriman, metode_pembayaran, total, currentDateTime, tracking_number]);
    
    await pool.query(
      'INSERT INTO orders (id_order, id_user, id_kupon, id_shipment, status_pembayaran, status_pengiriman, metode_pembayaran, total, datetime, no_resi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderId, userId, id_kupon, id_shipment, status_pembayaran, status_pengiriman, metode_pembayaran, total, currentDateTime, tracking_number]
    );
    
    console.log('Order inserted successfully');

    console.log('Inserting order details...');
    for (const item of order_details) {  
      const { product_id, quantity, price } = item;
      console.log('Inserting item:', { product_id, quantity, price });
      await pool.query(
        'INSERT INTO detail_orders (id_detail_order, id_order, id_produk, qty) VALUES (?, ?, ?, ?)', 
        [uuidv4(), orderId, product_id, quantity]
      );
    }
    
    console.log('All order details inserted successfully');
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id_order: orderId,
        tracking_number: tracking_number,
        total: total,
        status_pembayaran: status_pembayaran,
        status_pengiriman: status_pengiriman
      }
    });

  } catch (error) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      code: error.code 
    });
  }
}
async function getOrderById(req, res) {
  try {
    console.log('=== GET ORDER BY ID ===');
    const { id } = req.params;
    console.log('Order ID requested:', id);
    console.log('User from auth:', req.user);

    if (!req.user || !req.user.id) {
      console.log('Authentication issue: req.user not properly set');
      return res.status(401).json({ message: "Authentication required - user ID not found in token" });
    }

    const userId = req.user.id;
    console.log('Authenticated user ID:', userId);

    const [orderRows] = await pool.query(
      `SELECT 
        o.id_order,
        o.id_user,
        o.total,
        o.status_pembayaran,
        o.status_pengiriman,
        o.metode_pembayaran,
        o.datetime,
        o.no_resi,
        o.id_kupon,
        o.id_shipment,
        c.kode_kupon,
        c.diskon,
        sd.shipping_method,
        sd.shipping_cost
      FROM orders o
      LEFT JOIN coupons c ON o.id_kupon = c.id_kupon
      LEFT JOIN shipment_details sd ON o.id_shipment = sd.id_shipment
      WHERE o.id_order = ? AND o.id_user = ?`,
      [id, userId]
    );

    if (orderRows.length === 0) {
      console.log('Order not found or access denied');
      return res.status(404).json({ message: "Order not found or access denied" });
    }

    const order = orderRows[0];
    console.log('Order found:', order.id_order);

    const [orderDetailsRows] = await pool.query(
      `SELECT 
        od.id_detail_order,
        od.id_produk,
        od.qty,
        p.nama_produk,
        p.harga,
        p.gambar_produk,
        (od.qty * p.harga) as subtotal
      FROM detail_orders od
      JOIN products p ON od.id_produk = p.id_produk
      WHERE od.id_order = ?`,
      [id]
    );

    console.log('Order details found:', orderDetailsRows.length, 'items');

   
    const orderDetails = {
      id_order: order.id_order,
      tracking_number: order.no_resi,
      user_id: order.id_user,
      total: order.total,
      status_pembayaran: order.status_pembayaran,
      status_pengiriman: order.status_pengiriman,
      metode_pembayaran: order.metode_pembayaran,
      datetime: order.datetime,
      coupon: order.id_kupon ? {
        kode_kupon: order.kode_kupon,
        diskon: order.diskon
      } : null,
      shipping: order.id_shipment ? {
        shipping_method: order.shipping_method,
        shipping_cost: order.shipping_cost
      } : null,
      items: orderDetailsRows.map(item => ({
        id_detail_order: item.id_detail_order,
        product_id: item.id_produk,
        product_name: item.nama_produk,
        price: item.harga,
        quantity: item.qty,
        subtotal: item.subtotal,
        image: item.gambar_produk
      }))
    };

    res.status(200).json({
      success: true,
      message: "Order details retrieved successfully",
      order: orderDetails
    });

  } catch (error) {
    console.error('=== GET ORDER ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}

module.exports = { createOrder, getOrderById};