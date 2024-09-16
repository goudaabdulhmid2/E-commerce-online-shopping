const express = require('express');

const reviewControllre = require('../controllers/reviewController');
const authControllre = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(reviewControllre.getReviews)
  .post(
    authControllre.protect,
    authControllre.restrictTo('user'),
    reviewControllre.createReview,
  );

router
  .route('/:id')
  .get(reviewControllre.getReview)
  .patch(
    authControllre.protect,
    authControllre.restrictTo('user'),
    reviewControllre.updateReview,
  )
  .delete(
    authControllre.protect,
    authControllre.restrictTo('user', 'admin', 'manger'),
    reviewControllre.deleteReview,
  );

module.exports = router;
