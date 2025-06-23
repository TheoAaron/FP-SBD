const { pool } = require('../config/mysql');

const index = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.json(rows);
  } catch (err) {

    res.status(500).json({ message: 'Server error' });
  }
}

const detail = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const [[rows]] = await pool.query('SELECT * FROM products WHERE id_produk = ?', [id]);

    if (!rows || (rows.length && rows.length === 0)) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.json(rows);
  } catch (err) {

    res.status(500).json({ message: 'Server error' });
  }
}

const createProduct = async (req, res) => {

  const {id_produk,nama_produk,description,avg_rating,harga,total_review,kategori,image,stock} = req.body;

  if ( nama_produk==''|| description=='' || !(harga.toString() && harga >= 0) || kategori=='' || image=='' || !stock.toString()) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!/^https?:\/\/(?!localhost)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/.*/.test(image)) {
    return res.status(400).json({ message: 'Image must be a valid URL' });
  }

  try {
    const [result] = await pool.query('INSERT INTO products (nama_produk, description, harga, kategori, image, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [ nama_produk, description, harga, kategori, image, stock]);
    res.status(201).json({message: 'Product created successfully',
    }
    );
  } catch (err) {

    res.status(500).json({ message: 'Server error' });
  }
}

const updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }
  const {id_produk,nama_produk,description,avg_rating,harga,total_review,kategori,image,stock} = req.body;

  if ( nama_produk==''|| description=='' || !(harga.toString() && harga >= 0) || kategori=='' || image=='' || !stock.toString()) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!/^https?:\/\/(?!localhost)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/.*/.test(image)) {
    return res.status(400).json({ message: 'Image must be a valid URL' });
  }

  try {
    const [result] = await pool.query('UPDATE products SET nama_produk = ?, description = ?, harga = ?, kategori = ?, image = ?, stock = ? WHERE id_produk = ?',
      [nama_produk, description, harga, kategori, image, stock, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (err) {

    res.status(500).json({ message: 'Server error' });
  }
}

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM products WHERE id_produk = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {

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

    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {getOrder, index, detail, createProduct, updateProduct, deleteProduct };
