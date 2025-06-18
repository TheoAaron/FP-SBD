const express = require("express");
const router = express.Router();
const {getProfile, updateProfile} = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");


// Login route
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
// router.post("/register", register);


module.exports = router;
