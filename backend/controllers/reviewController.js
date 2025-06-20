const { getDB } = require("../config/mongo");
const { pool } = require("../config/mysql");

// import { getDB } from "../config/mongo.js"; // ESM style
 // pastikan koneksi dibuat sebelum akses DB
// Ambil instance DB
// Ambil semua review untuk produk tertentu
const getReviewsByProduct = async (req, res) => {
    const db = getDB(); 
    const id_produk = req.params.id_produk;
    try {
        // Ambil review dari MongoDB
        const productReview = await db.collection("product_review").findOne({ id_produk });
        if (!productReview || !productReview.review) {
            return res.json({ reviews: [] });
        }
        // Ambil semua user_id unik dari review
        const userIds = productReview.review.map(r => r.user_id);
        let users = [];
        if (userIds.length > 0) {
            // Query ke MySQL untuk ambil username
            const [rows] = await pool.query(
                `SELECT id_user, username FROM users WHERE id_user IN (${userIds.map(() => '?').join(',')})`,
                userIds
            );
            users = rows;
        }
        // Gabungkan username ke review
        const reviewsWithUsername = productReview.review.map(r => {
            const user = users.find(u => u.id_user === r.user_id);
            return {
                ...r,
                username: user ? user.username : null
            };
        });
        res.json({ reviews: reviewsWithUsername });
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
        }

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
        res.status(201).json({ message: "Review berhasil ditambahkan" });
    } catch (err) {
        console.error('Error adding review:', err);
        res.status(500).json({ message: "Gagal menambah review", error: err });
    }
};

// ✅ Export dengan ESM
module.exports = { getReviewsByProduct, addReview };
