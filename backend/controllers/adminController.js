const { pool } = require('../config/mysql');

const index = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const createProduct = async (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await pool.query('INSERT INTO products (name, price, description) VALUES (?, ?, ?)', [name, price, description]);

    res.status(201).json({ id: result.insertId, name, price, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  
  if (!name || !price || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await pool.query('UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?', [name, price, description, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ id, name, price, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const getOrder = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders');

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}



module.exports = {getOrder, index, createProduct, updateProduct, deleteProduct };
// module.exports = {index};