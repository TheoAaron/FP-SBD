const express = require("express");
const router = express.Router();
const { getCart, addToCart, deleteFromCart } = require("../controllers/cartController");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware,getCart);
router.delete("/:id_produk", authMiddleware, deleteFromCart);
router.post("/add", authMiddleware, addToCart);

module.exports = router;