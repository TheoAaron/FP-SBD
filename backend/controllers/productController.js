const { pool } = require('../config/mysql');
const jwt = require('jsonwebtoken');
const { addLastView } = require('../controllers/lastViewController');
const { add } = require('lodash');

const JWT_SECRET = process.env.JWT_SECRET || 'APINGANTENG';

const getAllProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];
    const conditions = [];

    if (search) {
      const words = search.split(' ').filter(Boolean);

      const likeConditions = words.map(() => `(nama_produk LIKE ? OR description LIKE ?)`).join(' AND ');
      conditions.push(`(${likeConditions})`);
      words.forEach(word => {
        const term = `%${word}%`;
        params.push(term, term);
      });
    }

    if (category) {
      conditions.push('kategori = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getBestSellingProducts = async (req, res) => {
  try {
    const { getDB } = require("../config/mongo");
    const db = getDB();

    const query = `
  SELECT
  p.id_produk,
  p.nama_produk,
  p.harga,
  p.image,
  SUM(oi.qty) AS total_quantity
  FROM products p
  JOIN detail_orders oi ON p.id_produk = oi.id_produk
  JOIN orders o ON oi.id_order = o.id_order
  GROUP BY p.id_produk, p.nama_produk, p.harga, p.image
  ORDER BY total_quantity DESC
    `;

    const [rows] = await pool.query(query);

    if (!rows || rows.length === 0) {
      return res.status(200).json([]);
    }

    const productsWithRating = await Promise.all(
      rows.map(async (product) => {
        try {

          const reviews = await db.collection("product_review").find({
            id_produk: product.id_produk.toString()
          }).toArray();

          let avg_rating = 0;
          let total_review = reviews.length;

          if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + (review.rate || 0), 0);
            avg_rating = totalRating / reviews.length;
          }

          return {
            ...product,
            avg_rating: avg_rating,
            total_review: total_review
          };
        } catch (error) {
          console.error(`Error fetching reviews for product ${product.id_produk}:`, error);
          return {
            ...product,
            avg_rating: 0,
            total_review: 0
          };
        }
      })
    );

    res.status(200).json(productsWithRating);
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(200).json([]);
    }

    console.warn('Non-fatal DB error:', error.code);
    return res.status(200).json([]);
  }
};

const getProductById = async (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {

    const query = 'SELECT * FROM products WHERE id_produk = ?';
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
  getAllProducts,
  getBestSellingProducts,
  getProductById,
};
