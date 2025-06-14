const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const { getAllProducts} = require("../controllers/productController");

router.get("/products", getAllProducts);
// router.get("/products/:id", getProductById);
=======
const {
  getBestSellingProducts,
  getProductById,
} = require("../controllers/productController"); 

router.get("/bs", getBestSellingProducts);    
router.get("/:id", getProductById);

>>>>>>> f938691 (add bestseller&singleproduct api)

module.exports = router;