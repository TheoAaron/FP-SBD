const express = require("express");
const router = express.Router();
const {getOrder, index, detail, createProduct, updateProduct, deleteProduct} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

router.get("/order", getOrder);
router.get("/product", index);
router.get("/product/:id", detail);
router.post("/product", createProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

module.exports = router;
