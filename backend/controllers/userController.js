const { pool } = require('../config/mysql');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto')

const getProfile = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Debug log
    const userId = req.user.id;
    console.log('userId:', userId); // Debug log

    const [rows] = await pool.query('SELECT * FROM users WHERE id_user = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {last_name, first_name, email, address , current_password, new_password, phone_number} = req.body;
    const salt = process.env.PASSWORD_SALT;
    const current = crypto.createHash('sha256').update(`${current_password}${salt}`).digest('hex');
    const newp = crypto.createHash('sha256').update(`${new_password}${salt}`).digest('hex');

    const [rows] = await pool.query(`SELECT * FROM users WHERE id_user = ?`, [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    if(current !== rows[0].password && current_password != null){
        return res.status(401).json({message:"Incorrect Password"});
    }
    pool.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, address = ?, password = ?, phone_number = ? WHERE id_user = ? ', [first_name, last_name, email, address,newp,phone_number, userId])

    return res.status(200).json({message: "yay"});
  }catch(err){
    return res.status(500).json({message: "Server Error"});
  }


}

module.exports = { getProfile, updateProfile };