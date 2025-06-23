

const { pool } = require('../config/mysql');

const test = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { test };