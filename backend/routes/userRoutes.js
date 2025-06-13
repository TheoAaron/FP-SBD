const express = require("express");
const router = express.Router();
const {getProfile} = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");
const { get: _get } = require("lodash"); // Mengubah nama import dari lodash


// Login route
router.get('/profile', authMiddleware, getProfile);
// router.post("/register", register);


module.exports = router;
