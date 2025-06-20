const express = require('express');
const router = express.Router();
const { createCoupon, deleteCoupon, getAllCoupons, getCouponById } = require('../controllers/couponController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// GET /api/admin/coupon - Get all coupons (admin only)
router.get('/coupon', auth, admin, getAllCoupons);

// GET /api/admin/coupon/:id - Get coupon by ID (admin only)
router.get('/coupon/:id', auth, admin, getCouponById);

// POST /api/admin/coupon - Create new coupon (admin only)
router.post('/coupon', auth, admin, createCoupon);

// DELETE /api/admin/coupon/:id - Delete coupon (admin only)
router.delete('/coupon/:id', auth, admin, deleteCoupon);

module.exports = router;