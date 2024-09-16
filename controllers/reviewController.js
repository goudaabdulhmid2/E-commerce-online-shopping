const handlerFactory = require('./handlerFactory');
const Review = require('../models/reviewModel');

// @desc  Get all reviews
// @route GET /api/v1/reviews
// @access Public
exports.getReviews = handlerFactory.getAll(Review);

// @desc Get one review
// @route GET /api/v1/reviews/:id
// @access Public
exports.getReview = handlerFactory.getOne(Review);

// @desc create a review
// @route POST /api/v1/reviews/:id
// @access pivate/protect/User
exports.createReview = handlerFactory.createOne(Review);

// @desc update a review
// @route PATCH /api/v1/reviews/:id
// @access pivate/protect/User
exports.updateReview = handlerFactory.updateOne(Review);

// @desc delete a review
// @route DELETE /api/v1/reviews/:id
// @access pivate/protect/User-Admin/Manger
exports.deleteReview = handlerFactory.deleteOne(Review);
