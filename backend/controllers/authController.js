const { pool } = require('../config/mysql');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'APINGANTENG';

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: rows.id, email: rows.email, role: rows.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: "Login successful",token, user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };