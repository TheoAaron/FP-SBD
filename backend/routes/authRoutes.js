const express = require("express");
const router = express.Router();
const {index} = require("../controllers/adminController");


// Login route
router.post("/", index);


module.exports = router;
