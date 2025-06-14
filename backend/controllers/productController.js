const { pool } = require('../config/mysql');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'APINGANTENG';

// Function to get all products
const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
// // Function to get a product by ID
// const getProductById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json(rows[0]);
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }
module.exports = {
  getAllProducts
// GET Best Selling Products
const getBestSellingProducts = async (req, res) => {
  try {
    const query = `
      SELECT p.id, p.name, p.price, SUM(oi.quantity) AS total_quantity
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
      GROUP BY p.id
      ORDER BY total_quantity DESC
      LIMIT 10;
    `;

    const [rows] = await pool.query(query);

    if (!rows || rows.length === 0) {
      return res.status(200).json([{ id: null, name: null, price: null, total_quantity: null }]);
    }

    res.status(200).json(rows);
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(200).json([{ id: null, name: null, price: null, total_quantity: null }]);
    }

    // Tangani semua jenis error lainnya tetap aman
    console.warn('Non-fatal DB error:', error.code);
    return res.status(200).json([{ id: null, name: null, price: null, total_quantity: null }]);
  }
};
// GET Product by ID
const getProductById = async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const query = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await pool.query(query, [productId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getBestSellingProducts,
  getProductById
};