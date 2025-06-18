const express = require("express");
const router = express.Router();
const { getAllProducts} = require("../controllers/productController");

const {
  getBestSellingProducts,
  getProductById,
} = require("../controllers/productController"); 

router.get("/", getAllProducts);
router.get("/bs", getBestSellingProducts);    
router.get("/:id", getProductById);

module.exports = router;