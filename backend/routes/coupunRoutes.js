const express = require('express');
const router = express.Router();
const { createCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon, validateCoupon } = require('../controllers/couponController');

router.get('/coupon', getAllCoupons);

router.get('/coupon/:id', getCouponById);

router.post('/coupon', createCoupon);

router.put('/coupon/:id', updateCoupon);

router.delete('/coupon/:id', deleteCoupon);

router.post('/coupon/validate', validateCoupon);

module.exports = router;
