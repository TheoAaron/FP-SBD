const express = require("express");
const router = express.Router();
const { getAllProducts} = require("../controllers/productController");

router.get("/products", getAllProducts);
// router.get("/products/:id", getProductById);

module.exports = router;