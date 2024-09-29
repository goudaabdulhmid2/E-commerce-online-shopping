const handlerFactory = require('./handlerFactory');
const Coupon = require('../models/couponModel');

// @desc Create a new Coupon
// @route POST api/v1/coupons
// @access private/admin/manager
exports.createCoupon = handlerFactory.createOne(Coupon);

// @desc Get all Coupons
// @route GET api/v1/coupons
// @access private/admin/manager
exports.getAllCoupons = handlerFactory.getAll(Coupon);

// @desc Get a single Coupon
// @route GET api/v1/coupons/:id
// @access private/admin/manager
exports.getCoupon = handlerFactory.getOne(Coupon);

// @desc delete a single Coupon
// @route DELETE api/v1/coupons/:id
// @access private/admin/manager
exports.deleteCoupon = handlerFactory.deleteOne(Coupon);

// @desc update a single Coupon
// @route PATCH api/v1/coupons/:id
// @access private/admin/manager
exports.updateCoupon = handlerFactory.updateOne(Coupon);
