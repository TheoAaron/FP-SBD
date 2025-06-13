const { pool } = require('../config/mysql');


const getProfile = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Debug log
    const userId = req.user.id;
    console.log('userId:', userId); // Debug log

    const [rows] = await pool.query('SELECT id_user, email, role FROM users WHERE id_user = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = { getProfile };