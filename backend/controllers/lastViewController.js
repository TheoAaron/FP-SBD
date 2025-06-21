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
    `;    const [rows] = await pool.query(query, lastView.produk);
    
    // Sort rows based on the order in lastView.produk array to preserve chronological order
    const sortedRows = lastView.produk.map(produkId => 
      rows.find(row => row.id_produk === produkId)
    ).filter(Boolean); // Remove any undefined entries
    
    // Ambil rating dari MongoDB untuk setiap produk
    const productsWithRating = await Promise.all(
      sortedRows.map(async (product) => {
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

    // Pastikan produk dalam bentuk string untuk konsistensi (MongoDB menyimpan sebagai string)
    const produkId = Array.isArray(produk) ? produk[0] : produk;
    const produkString = produkId.toString();
    console.log('Product ID (string):', produkString);

    // Cek apakah user sudah memiliki lastView
    const existingLastView = await db.collection("last_view").findOne({ id_user });
    console.log('Existing last view:', existingLastView);

    if (existingLastView) {
      // Hapus produk dari array jika sudah ada (untuk menghindari duplikasi)
      let currentProduk = existingLastView.produk || [];
      console.log('Current produk before filter:', currentProduk);
      
      // Filter out produk yang sama (baik string maupun number)
      currentProduk = currentProduk.filter(p => p.toString() !== produkString);
      console.log('Current produk after filter:', currentProduk);
      
      // Tambahkan produk baru di posisi pertama
      const newProdukArray = [produkString, ...currentProduk];
      console.log('New produk array:', newProdukArray);
      
      // Batasi maksimal 10 item terakhir untuk performa
      const limitedArray = newProdukArray.slice(0, 10);
      console.log('Limited array (max 10):', limitedArray);
      
      // Update dengan array yang sudah dibersihkan dan ditambah item baru
      await db.collection("last_view").updateOne(
        { id_user },
        { $set: { produk: limitedArray } }
      );
    } else {
      // Buat lastView baru jika belum ada
      await db.collection("last_view").insertOne({
        id_user,
        produk: [produkString]
      });
    }

    // Verifikasi hasil akhir
    const finalLastView = await db.collection("last_view").findOne({ id_user });
    console.log('Final last view after update:', finalLastView);

    res.json({ message: "LastView berhasil ditambahkan/diupdate" });
  } catch (error) {
    console.error('Error in addLastView:', error);
    res.status(500).json({ message: "Gagal menambahkan/mengupdate lastView", error: error.message });
  }
}
module.exports = { getLastViewByUser, addLastView };
