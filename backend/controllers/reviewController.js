const { getDB } = require("../config/mongo");
const {pool} = require("../config/mysql");


const getReviewsByProduct = async (req, res) => {
    const db = getDB(); 
    const id_produk = req.params.id_produk;
    try {
        // Find the product review document with the new structure
        const reviewDoc = await db.collection("product_review").findOne({ id_produk });
        
        if (!reviewDoc) {
            return res.json({ 
                id_produk,
                total_review: 0,
                reviews: []
            });
        }
        
        res.json({ 
            id_produk: reviewDoc.id_produk,
            total_review: reviewDoc.total_review || 0,
            reviews: reviewDoc.reviews || []
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil review", error });
    }
};

// Tambah review untuk produk tertentu
const addReview = async (req, res) => {
    const db = getDB();
    const id_produk = req.params.id_produk;
    const id_user = req.user.id;
    const { rating, comment } = req.body;
    
    // Get username from MySQL database
    try {
        const [userRows] = await pool.query('SELECT username FROM users WHERE id_user = ?', [id_user]);
        const username = userRows.length > 0 ? userRows[0].username : 'aron';
        
        console.log('User ID:', id_user);
        console.log('Username found:', username);

        if (!rating || !comment) {
            return res.status(400).json({ message: "Silahkan Rating dan Reviewnya diisi!" });
        }

        // Check if product review document exists
        const existingDoc = await db.collection("product_review").findOne({ id_produk });
        
        const newReview = {
            id_user: id_user,
            username: username,
            rate: rating,
            comment: comment,
            date: new Date()
        };

        if (existingDoc) {
            // Update existing document - add review and increment total_review
            const result = await db.collection("product_review").updateOne(
                { id_produk },
                {
                    $push: { reviews: newReview },
                    $inc: { total_review: 1 }
                }
            );
        } else {
            // Create new document with the new structure
            const result = await db.collection("product_review").insertOne({
                id_produk: id_produk,
                total_review: 1,
                reviews: [newReview]
            });
        }
        
        res.status(201).json({ message: "Review berhasil ditambahkan" });
    } catch (err) {
        console.error('Error adding review:', err);
        res.status(500).json({ message: "Gagal menambah review", error: err });
    }
};

// ✅ Export dengan ESM
module.exports = { getReviewsByProduct, addReview };
