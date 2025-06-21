const { getDB } = require("../config/mongo");
const { pool } = require("../config/mysql");
const { syncSingleProductReviews } = require("../utils/syncReviews");

const getReviewsByProduct = async (req, res) => {
    const db = getDB(); 
    const id_produk = req.params.id_produk;
    try {
        // Find documents that match the product ID with the new structure
        const reviews = await db.collection("product_review").find({ id_produk: parseInt(id_produk) }).toArray();
        
        res.json({ 
            reviews: reviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: "Gagal mengambil review", error });
    }
};

// Tambah review untuk produk tertentu
const addReview = async (req, res) => {
    const db = getDB();
    const id_produk = parseInt(req.params.id_produk);
    const id_user = req.user.id;
    const { rating, comment } = req.body;
    
    try {
        // Get username from MySQL database
        const [userRows] = await pool.query('SELECT username FROM users WHERE id_user = ?', [id_user]);
        const username = userRows.length > 0 ? userRows[0].username : 'Anonymous';
        
        console.log('User ID:', id_user);
        console.log('Username found:', username);

        if (!rating || !comment) {
            return res.status(400).json({ message: "Silahkan Rating dan Reviewnya diisi!" });
        }

        const newReview = {
            id_user: id_user,
            username: username,
            rate: parseInt(rating),
            comment: comment,
            date: new Date()
        };

        // Check if document exists for this product
        const existingDoc = await db.collection("product_review").findOne({ id_produk });
        
        if (existingDoc) {
            // Add to existing review array
            await db.collection("product_review").updateOne(
                { id_produk },
                { $push: { review: newReview } }
            );
        } else {
            // Create new document
            await db.collection("product_review").insertOne({
                id_produk: id_produk,
                review: [newReview]
            });
        }
        
        // Sync review count and average rating to MySQL
        await syncSingleProductReviews(id_produk);
        
        res.status(201).json({ message: "Review berhasil ditambahkan" });
    } catch (err) {
        console.error('Error adding review:', err);
        res.status(500).json({ message: "Gagal menambah review", error: err });
    }
};

module.exports = { getReviewsByProduct, addReview };
