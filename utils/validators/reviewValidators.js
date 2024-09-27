const { check } = require('express-validator');
const catchAsync = require('express-async-handler');

const validatorController = require('../../controllers/validatorController');
const Review = require('../../models/reviewModel');

exports.createReviewValidator = [
  check('title').optional(),
  check('rating')
    .notEmpty()
    .withMessage('Rating value is required.')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating value must be between 1 and 5.'),
  check('user').isMongoId().withMessage('Invalid user id format.'),
  check('product')
    .isMongoId()
    .withMessage('Invalid product id format.')
    .custom(
      catchAsync(async (val, { req }) => {
        const existingReview = await Review.findOne({
          user: req.user.id,
          product: req.body.product,
        });
        if (existingReview) {
          throw new Error('You already have a review for this product.');
        }
        return true;
      }),
    ),
  validatorController.catchError,
];

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid review id format.'),
  validatorController.catchError,
];

exports.updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid review id format.')
    .custom(
      catchAsync(async (val, { req }) => {
        // Check review ownership
        const review = await Review.findById(val);
        if (!review) {
          throw new Error('Review not found.');
        }

        if (review.user._id.toString() !== req.user.id) {
          throw new Error('Unauthorized to update this review.');
        }
        return true;
      }),
    ),
  check('rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('rating value must be between 1 and 5.'),
  validatorController.catchError,
];

exports.deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid review id format.')
    .custom(
      catchAsync(async (val, { req }) => {
        // Check review ownership
        if (req.user.role === 'user') {
          const review = await Review.findById(val);
          if (!review) {
            throw new Error('Review not found.');
          }
          if (review.user._id.toString() !== req.user.id) {
            throw new Error('Unauthorized to delete this review.');
          }
        }

        return true;
      }),
    ),
  validatorController.catchError,
];
