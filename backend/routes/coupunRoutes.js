const express = require('express');
const router = express.Router();
const { createCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon } = require('../controllers/couponController');

// GET /api/admin/coupon - Get all coupons (admin only)
router.get('/coupon', getAllCoupons);

// GET /api/admin/coupon/:id - Get coupon by ID (admin only)
router.get('/coupon/:id', getCouponById);

// POST /api/admin/coupon - Create new coupon (admin only)
router.post('/coupon', createCoupon);

// PUT /api/admin/coupon/:id - Update coupon (admin only)
router.put('/coupon/:id', updateCoupon);

// DELETE /api/admin/coupon/:id - Delete coupon (admin only)
router.delete('/coupon/:id', deleteCoupon);

module.exports = router;