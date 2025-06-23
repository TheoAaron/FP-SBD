const { getDB } = require("../config/mongo");
const { pool } = require("../config/mysql");
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'APINGANTENG';

const getLastViewByUser = async (req, res) => {
  try {
    const db = getDB();

    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "id_user wajib diisi" });
    }    const lastView = await db.collection("last_view").findOne({ id_user: userId });
    if (!lastView) {
      return res.json({ rows: [] });
    }

    if (!lastView.produk || !Array.isArray(lastView.produk) || lastView.produk.length === 0) {
      return res.json({ rows: [] });
    }
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

    const sortedRows = lastView.produk.map(produkId =>
      rows.find(row => row.id_produk === produkId)
    ).filter(Boolean);

    const productsWithRating = await Promise.all(
      sortedRows.map(async (product) => {
        try {

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

    const produkId = Array.isArray(produk) ? produk[0] : produk;
    const produkString = produkId.toString();
    console.log('Product ID (string):', produkString);

    const existingLastView = await db.collection("last_view").findOne({ id_user });
    console.log('Existing last view:', existingLastView);

    if (existingLastView) {

      let currentProduk = existingLastView.produk || [];
      console.log('Current produk before filter:', currentProduk);

      currentProduk = currentProduk.filter(p => p.toString() !== produkString);
      console.log('Current produk after filter:', currentProduk);

      const newProdukArray = [produkString, ...currentProduk];
      console.log('New produk array:', newProdukArray);

      const limitedArray = newProdukArray.slice(0, 10);
      console.log('Limited array (max 10):', limitedArray);

      await db.collection("last_view").updateOne(
        { id_user },
        { $set: { produk: limitedArray } }
      );
    } else {

      await db.collection("last_view").insertOne({
        id_user,
        produk: [produkString]
      });
    }

    const finalLastView = await db.collection("last_view").findOne({ id_user });
    console.log('Final last view after update:', finalLastView);

    res.json({ message: "LastView berhasil ditambahkan/diupdate" });
  } catch (error) {
    console.error('Error in addLastView:', error);
    res.status(500).json({ message: "Gagal menambahkan/mengupdate lastView", error: error.message });
  }
}
module.exports = { getLastViewByUser, addLastView };
