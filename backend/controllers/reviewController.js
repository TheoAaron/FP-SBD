const { getDB } = require("../config/mongo");
const {pool} = require("../config/mysql");

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

const addReview = async (req, res) => {
    const db = getDB();
    const id_produk = req.params.id_produk;
    const id_user = req.user.id;
    const { rating, comment,  } = req.body;

    try {
        const [userRows] = await pool.query('SELECT username FROM users WHERE id_user = ?', [id_user]);
        const username = userRows.length > 0 ?  userRows[0].username: 'aron';

        console.log('User ID:', id_user);
        console.log('Username found:', username);

        if (!rating || !comment) {
            return res.status(400).json({ message: "Silahkan Rating dan Reviewnya diisi!" });
        }
        const newReview = {
            id_user : id_user,
            username: username,
            rate: rating,
            comment: comment,
            date: new Date()
        };

        const existingDoc = await db.collection("product_review").findOne({ id_produk });

        let result;        if (existingDoc) {

            result = await db.collection("product_review").updateOne(
                { id_produk },
                {
                    $push: {
                        reviews: newReview
                    }
                }
            );
        } else {

            result = await db.collection("product_review").insertOne({
                id_produk: id_produk,
                total_review: 1,
                reviews: [newReview]
            });
        }

        const updatedDoc = await db.collection("product_review").findOne({ id_produk });
        const totalReviews = updatedDoc ? updatedDoc.reviews.length : 1;
        const avgRating = updatedDoc ?
            updatedDoc.reviews.reduce((sum, r) => sum + r.rate, 0) / totalReviews : rating;

        await db.collection("product_review").updateOne(
            { id_produk },
            {
                $set: {
                    total_review: totalReviews
                }
            }        );

        await pool.query(
            'UPDATE products SET total_review = ?, avg_rating = ? WHERE id_produk = ?',
            [totalReviews, avgRating, id_produk]
        );

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

module.exports = { getReviewsByProduct, addReview };
