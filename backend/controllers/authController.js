const { pool } = require('../config/mysql');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { waitForDebugger } = require('inspector');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'APINGANTENG';

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });

    }
    const salt = process.env.PASSWORD_SALT;
    const pass = crypto.createHash('sha256').update(`${password}${salt}`).digest('hex');
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, pass]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id_user,  role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: "Login successful", token, user: user, redirect: '/' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const register = async (req, res) => {
 try {
  const{email, name, password} = req.body;
  if (!email || !name || !password){
    return res.status(400).json({message: "Ensure all Component is fulfilled"});
  }
  const salt = process.env.PASSWORD_SALT;
  const pass = crypto.createHash('sha256').update(`${password}${salt}`).digest('hex');

  const [rows1] = await pool.query('SELECT * FROM users WHERE username = ?', [name]);
  const [rows2] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

  if (rows1.length > 0){
    return res.status(401).json({message: "Username Already Taken"});
  }
  else if (rows2.length > 0){
        return res.status(401).json({message: "Email Already Exist"});
  }
  try{
   pool.query('INSERT INTO users (id_user, email, username, password, createdAt, updatedAt) VALUES (?, ?, ? ,?,?, ?)', [uuidv4(), email, name, pass, new Date(), new Date()]);
   return res.status(200).json({message: "Register Succeed"});
  }catch (err) {
    return res.status(500).json({message: "Server Error"});
  }
 }
 catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { login, register };
