const express = require("express");
const router = express.Router();
const {getOrder, index, createProduct, updateProduct, deleteProduct} = require("../controllers/adminController");

router.get("/order", getOrder);
router.get("/product", index);
router.post("/product", createProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);


module.exports = router;
