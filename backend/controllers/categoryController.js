const { pool } = require("../config/mysql");
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'APINGANTENG';

const getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT kategori FROM products");
    // Jika nama field di tabel Anda 'category', ganti jadi SELECT DISTINCT category FROM products
    res.json({ categories: rows.map(row => row.kategori) });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil kategori", error: err });
  }
};

module.exports = { getAllCategories };