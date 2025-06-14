const { pool } = require('../config/mongoose');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'APINGANTENG';

const ProductReview = mongoose.model('product_review', product_review);
const User = mongoose.model('id_user', id_user);
const Product = mongoose.model('id_product', id_product);

const badWords = [
  'anjing', 'babi', 'bangsat', 'bajingan', 'kontol', 'memek', 'ngentot', 'puki', 'tolol', 'goblok', 'tai', 'shit', 'fuck', 'asshole', 'bitch',
];

const containsBadWords = (text) => {
  const lowerText = text.toLowerCase();
  return badWords.some(word => lowerText.includes(word));
};

const getReviewPerProduct = async (req, res) => {
  try {
    const { id_product } = req.params;

    if (!id_product || isNaN(id_product)) {
      return res.status(400).json({
        success: false,
        message: 'ID produk harus berupa angka yang valid'
      });
    }

    const productId = parseInt(id_product);
    const productExists = await Product.findOne({ id: productId });

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan',
        data: {
          reviews: [],
          statistics: {
            total_reviews: 0,
            average_rating: 0,
            rating_distribution: {
              5: 0, 4: 0, 3: 0, 2: 0, 1: 0
            }
          }
        }
      });
    }

    const productReview = await ProductReview.findOne({ id_product: productId })
      .populate('review.user_id', 'username email');

    if (!productReview || !productReview.review || productReview.review.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Produk ditemukan tetapi belum ada review',
        data: {
          reviews: [],
          statistics: {
            total_reviews: 0,
            average_rating: 0,
            rating_distribution: {
              5: 0, 4: 0, 3: 0, 2: 0, 1: 0
            }
          }
        }
      });
    }

    const reviews = productReview.review.map(review => ({
      id: review._id,
      id_user: review.user_id ? review.user_id._id : null,
      id_product: productId,
      rating: review.rate,
      comment: review.comment,
      created_at: review.date,
      username: review.user_id ? review.user_id.username : 'Unknown User',
      email: review.user_id ? review.user_id.email : null
    })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    return res.status(200).json({
      success: true,
      message: 'Review berhasil diambil',
      data: {
        product: {
          id: productExists.id,
          name: productExists.name
        },
        reviews: reviews,
        statistics: {
          total_reviews: totalReviews,
          average_rating: parseFloat(averageRating),
          rating_distribution: ratingDistribution
        }
      }
    });

  } catch (error) {
    console.error('Error getting reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const review = async (req, res) => {
  return getReviewPerProduct(req, res);
};

module.exports = { 
  review,
  getReviewPerProduct 
};