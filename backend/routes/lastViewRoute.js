const express = require("express");
const router = express.Router();
const { getLastViewByUser,addLastView } = require("../controllers/lastViewController");
const { getDB } = require("../config/mongo");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware, getLastViewByUser);

router.put("/", authMiddleware, addLastView);

module.exports = router;
