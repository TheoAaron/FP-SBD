const express = require('express');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, getWishlist);
router.post('/', auth, addToWishlist);
router.delete('/:product_id', auth, removeFromWishlist);

module.exports = router;
