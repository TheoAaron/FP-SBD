const express = require("express");
const router = express.Router();
const {getOrder, index, createProduct, updateProduct, deleteProduct} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

router.get("/order",authMiddleware, adminMiddleware, getOrder);
router.get("/product",authMiddleware, adminMiddleware, index);
router.post("/product",authMiddleware, adminMiddleware, createProduct);
router.put("/product/:id",authMiddleware, adminMiddleware, updateProduct);
router.delete("/product/:id",authMiddleware, adminMiddleware, deleteProduct);


module.exports = router;
