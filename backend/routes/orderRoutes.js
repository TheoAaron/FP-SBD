const express = require('express');
const router = express.Router();
const { createOrder, getOrderById } = require('../controllers/orderController');
const auth = require('../middlewares/auth');

router.post('/', auth, createOrder);
router.get('/:id', auth, getOrderById);

module.exports = router;
