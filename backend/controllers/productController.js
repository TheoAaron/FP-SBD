const { pool } = require('../config/mysql');
const jwt = require('jsonwebtoken');

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
    const query = `
  SELECT 
  p.id_produk,
  p.nama_produk,
  p.harga,
  p.avg_rating,
  p.total_review, 
  SUM(oi.qty) AS total_quantity
  FROM products p
  JOIN detail_orders oi ON p.id_produk = oi.id_produk
  JOIN orders o ON oi.id_order = o.id_order
  GROUP BY p.id_produk, p.nama_produk, p.harga, p.avg_rating, p.total_review
  ORDER BY total_quantity DESC
    `;

    const [rows] = await pool.query(query);

    if (!rows || rows.length === 0) {
      return res.status(200).json([{ id: null, name: null, price: null, total_quantity: null, avg_rating: null, total_review: null }]);
    }

    res.status(200).json(rows);
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(200).json([{ id: null, name: null, price: null, total_quantity: null, avg_rating: null, total_review: null }]);
    }

    // Tangani semua jenis error lainnya tetap aman
    console.warn('Non-fatal DB error:', error.code);
    return res.status(200).json([{ id: null, name: null, price: null, total_quantity: null, avg_rating: null, total_review: null }]);
  }
};
// GET Product by ID
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