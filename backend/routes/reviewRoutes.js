const express = require("express");
const router = express.Router();
const { getReviewPerProduct } = require("../controllers/reviewController");

router.get('/:id_product', getReviewPerProduct);

module.exports = router;