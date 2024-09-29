const express = require('express');

const couponController = require('../controllers/couponController');
const authController = require('../controllers/authController');
const {
  createCouponValidator,
  updateCouponValidator,
  getCouponValidator,
  deleteCouponValidator,
} = require('../utils/validators/couponValidatores');

const router = express.Router();

router.use(
  authController.protect,
  authController.restrictTo('admin', 'manger'),
);

router
  .route('/')
  .get(couponController.getAllCoupons)
  .post(createCouponValidator, couponController.createCoupon);
router
  .route('/:id')
  .get(getCouponValidator, couponController.getCoupon)
  .delete(deleteCouponValidator, couponController.deleteCoupon)
  .patch(updateCouponValidator, couponController.updateCoupon);

module.exports = router;
