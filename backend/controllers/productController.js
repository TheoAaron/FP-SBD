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
};