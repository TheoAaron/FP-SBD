<<<<<<< HEAD
import { getDB } from "../config/mongo.js"; // ESM style
 // pastikan koneksi dibuat sebelum akses DB
// Ambil instance DB

=======
const { getDB } = require("../config/mongo");

// import { getDB } from "../config/mongo.js"; // ESM style
 // pastikan koneksi dibuat sebelum akses DB
// Ambil instance DB
>>>>>>> ba716e84b04737628502ae863bd2b303c8ed37d4
// Ambil semua review untuk produk tertentu
const getReviewsByProduct = async (req, res) => {
    const db = getDB(); 
    const id_produk = parseInt(req.params.id_produk);
    try {
        const reviews = await db.collection("product_review").find({ id_produk }).toArray();
        res.json({ reviews });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil review", error });
    }
};

// Tambah review untuk produk tertentu
const addReview = async (req, res) => {
<<<<<<< HEAD
    const id_produk = parseInt(req.params.id_produk);
=======
    const db = getDB();
    const id_produk = req.params.id_produk;
>>>>>>> ba716e84b04737628502ae863bd2b303c8ed37d4
    const id_user = req.user.id;
    const { rating, review } = req.body;

    if (!rating || !review) {
        return res.status(400).json({ message: "Silahkan Rating dan Reviewnya diisi!" });
    }

    try {
        const result = await db.collection("product_review").updateOne(
            { id_produk },
            {
                $push: {
                    review: {
                        user_id: id_user,
                        rate: rating,
                        comment: review,
                        date: new Date()
                    }
                }
            },
            { upsert: true }
        );
        res.status(201).json({ message: "Review berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ message: "Gagal menambah review", error: err });
    }
};

// ✅ Export dengan ESM
<<<<<<< HEAD
export { getReviewsByProduct, addReview };
=======
module.exports = { getReviewsByProduct, addReview };
>>>>>>> ba716e84b04737628502ae863bd2b303c8ed37d4
