const { getDB } = require("../config/mongo");
const {pool} = require("../config/mysql");
const { syncSingleProductReview } = require("../utils/syncReviews");

// import { getDB } from "../config/mongo.js"; // ESM style
 // pastikan koneksi dibuat sebelum akses DB
// Ambil instance DB
// Ambil semua review untuk produk tertentu
const getReviewsByProduct = async (req, res) => {
    const db = getDB(); 
    const id_produk = req.params.id_produk;
    try {
        const reviews = await db.collection("product_review").find({ id_produk }).toArray();
        res.json({ reviews });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil review", error });
    }
};

// Tambah review untuk produk tertentu
const addReview = async (req, res) => {
    const db = getDB();
    const id_produk = req.params.id_produk;
    const id_user = req.user.id;
    const { rating, comment,  } = req.body;
    
    // Get username from MySQL database
    try {
        const [userRows] = await pool.query('SELECT username FROM users WHERE id_user = ?', [id_user]);
        const username = userRows.length > 0 ?  userRows[0].username: 'aron';
        
        console.log('User ID:', id_user);
        console.log('Username found:', username);

        if (!rating || !comment) {
            return res.status(400).json({ message: "Silahkan Rating dan Reviewnya diisi!" });
        }        // Tambah review ke MongoDB
        const result = await db.collection("product_review").updateOne(
            { id_produk },
            {
                $push: {
                    review: {
                        username: username, // Only store username, not user_id
                        rate: rating,
                        comment: comment,
                        date: new Date()
                    }
                }
            },
            { upsert: true }        );

        // Sync review count dan rating ke MySQL
        const { totalReviews, avgRating } = await syncSingleProductReview(id_produk);

        res.status(201).json({ 
            message: "Review berhasil ditambahkan",
            totalReviews,
            avgRating: parseFloat(avgRating.toFixed(2))
        });
    } catch (err) {
        console.error('Error adding review:', err);
        res.status(500).json({ message: "Gagal menambah review", error: err });
    }
};

// ✅ Export dengan ESM
module.exports = { getReviewsByProduct, addReview };
