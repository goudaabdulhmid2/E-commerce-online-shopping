const handlerFactory = require('./handlerFactory');
const Review = require('../models/reviewModel');

// @desc  Get all reviews
// @route GET /api/v1/reviews
// @access Public
exports.getReviews = handlerFactory.getAll(Review, 'Review');

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

// Nested Route
// @desc CREATE all reviews for a product
// @route CREATE api/v1/products/:productId/reviews
// @access privet/protect/User
exports.setIds = (req, res, next) => {
  if (!req.body.user && req.user) req.body.user = req.user.id;

  if (!req.body.product && req.params.productId)
    req.body.product = req.params.productId;

  next();
};

// Nested Route
// @desc GET all reviews for a product
// @route GET api/v1/products/:productId/reviews
// @access public
exports.reviewsFilter = (req, res, next) => {
  let filterObj = {};
  if (req.params.productId) filterObj = { product: req.params.productId };
  req.filterObj = filterObj;
  next();
};
