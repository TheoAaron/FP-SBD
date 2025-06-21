const { getDB } = require("../config/mongo");
const { pool } = require("../config/mysql");
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'APINGANTENG';

// Mendapatkan lastView pengguna berdasarkan user id
const getLastViewByUser = async (req, res) => {
  try {
    const db = getDB();
    // Ambil userId dari query atau body
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "id_user wajib diisi" });
    }    const lastView = await db.collection("last_view").findOne({ id_user: userId });
    if (!lastView) {
      return res.json({ rows: [] });
    }
    
    // Pastikan produk adalah array dan tidak kosong
    if (!lastView.produk || !Array.isArray(lastView.produk) || lastView.produk.length === 0) {
      return res.json({ rows: [] });
    }      // Buat placeholder untuk setiap produk
    const placeholders = lastView.produk.map(() => '?').join(',');    const query = `
      SELECT 
        p.id_produk, 
        p.nama_produk, 
        p.harga, 
        p.image, 
        p.stock
      FROM products p 
      WHERE p.id_produk IN (${placeholders})
    `;
    const [rows] = await pool.query(query, lastView.produk);
    
    // Ambil rating dari MongoDB untuk setiap produk
    const productsWithRating = await Promise.all(
      rows.map(async (product) => {
        try {
          // Aggregate reviews untuk produk ini dari MongoDB
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
    
    console.log('Query result with ratings from MongoDB:', productsWithRating);
    res.json({ rows: productsWithRating });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil lastView", error });
  }
};

// Buat helper function untuk operasi delete
// Helper function untuk operasi delete
const removeProductFromLastView = async (userId, produkId) => {
  try {
    const db = getDB();
    const result = await db.collection("last_view").updateOne(
      { id_user: userId },
      { $pull: { produk: produkId } }
    );

    
    return result.modifiedCount > 0;
  } catch (error) {
    throw error;
  }
}

const addLastView = async (req, res) => {
  try {
    console.log('=== ADD LAST VIEW START ===');
    const db = getDB();
    const { produk } = req.body;
    const id_user = req.user?.id;

    console.log('User ID:', id_user);
    console.log('Product ID:', produk);

    if (!id_user || !produk) {
      console.log('Missing required fields:', { id_user, produk });
      return res.status(400).json({ message: "id_user dan id_produk wajib diisi" });
    }

    // Pastikan produk dalam bentuk array untuk konsistensi
    const produkArray = Array.isArray(produk) ? produk : [produk];
    console.log('Product array:', produkArray);

    // Hapus produk dari lastView dulu kalau sudah ada (supaya bisa dipindah ke urutan pertama)
    for (const p of produkArray) {
      await removeProductFromLastView(id_user, p);
    }

    // Cek apakah user sudah memiliki lastView
    const existingLastView = await db.collection("last_view").findOne({ id_user });
    console.log('Existing last view:', existingLastView);

    if (existingLastView) {
      // Tambahkan ke urutan pertama menggunakan $push dengan $position: 0
      await db.collection("last_view").updateOne(
        { id_user },
        { 
          $push: { 
            produk: { 
              $each: produkArray,
              $position: 0  
            } 
          } 
        }
      );
    } else {
      // Buat lastView baru jika belum ada
      await db.collection("last_view").insertOne({
        id_user,
        produk: produkArray
      });
    }

    res.json({ message: "LastView berhasil ditambahkan/diupdate" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan/mengupdate lastView", error });
  }
}
module.exports = { getLastViewByUser, addLastView };
