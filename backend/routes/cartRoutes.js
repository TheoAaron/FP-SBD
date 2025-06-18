const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateCart } = require("../controllers/cartController");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware,getCart);
router.post("/update", authMiddleware, updateCart);
router.post("/add", authMiddleware, addToCart);

module.exports = router;