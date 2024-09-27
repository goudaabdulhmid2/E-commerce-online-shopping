const express = require('express');

const reviewControllre = require('../controllers/reviewController');
const authControllre = require('../controllers/authController');
const reviewValidator = require('../utils/validators/reviewValidators');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewControllre.reviewsFilter, reviewControllre.getReviews)
  .post(
    authControllre.protect,
    authControllre.restrictTo('user'),
    reviewControllre.setIds,
    reviewValidator.createReviewValidator,
    reviewControllre.createReview,
  );

router
  .route('/:id')
  .get(reviewValidator.getReviewValidator, reviewControllre.getReview)
  .patch(
    authControllre.protect,
    authControllre.restrictTo('user'),
    reviewValidator.updateReviewValidator,
    reviewControllre.updateReview,
  )
  .delete(
    authControllre.protect,
    authControllre.restrictTo('user', 'admin', 'manger'),
    reviewValidator.deleteReviewValidator,
    reviewControllre.deleteReview,
  );

module.exports = router;
