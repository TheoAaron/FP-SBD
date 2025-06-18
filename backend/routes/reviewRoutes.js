const express = require("express");
const router = express.Router();
const { getReviewsByProduct, addReview } = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/auth");
const { requirePurchase } = require("../middlewares/purchase");

router.get("/:id_produk", getReviewsByProduct);

router.post("/:id_produk", authMiddleware, requirePurchase, addReview);

module.exports = router;