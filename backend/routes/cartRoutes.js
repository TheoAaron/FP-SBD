const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateCart, deleteCart } = require("../controllers/cartController");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware,getCart);
router.put("/update", authMiddleware, updateCart);
router.post("/add", authMiddleware, addToCart);
router.delete("/", authMiddleware, deleteCart);

module.exports = router;