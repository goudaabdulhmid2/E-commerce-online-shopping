const { check } = require('express-validator');
const catchAsync = require('express-async-handler');

const validatorController = require('../../controllers/validatorController');
const Coupon = require('../../models/couponModel');

exports.createCouponValidator = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Coupon name is required')
    .isLength({ min: 3, max: 32 })
    .withMessage('Coupon name must be between 3 and 32 characters')
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('Coupon name must contain only letters and numbers'),
  check('expire')
    .notEmpty()
    .withMessage('Coupon expiration is required')
    .isISO8601()
    .withMessage('Please provide a valid expiration date'),
  check('discount')
    .notEmpty()
    .withMessage('Coupon discount is required')
    .isNumeric()
    .withMessage('Coupon discount must be a number')
    .isFloat({ min: 1, max: 100 })
    .withMessage('Coupon discount must be between 1 and 100'),
  validatorController.catchError,
];

exports.updateCouponValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid coupon id format.')
    .custom((val, { req }) => {
      if (req.body.name) {
        req.body.name = req.body.name.toUpperCase();
      }
      return true;
    }),
  check('name')
    .trim()
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage('Coupon name must be between 3 and 32 characters')
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('Coupon name must contain only letters and numbers')
    .custom(
      catchAsync(async (val, { req }) => {
        const coupon = await Coupon.findOne({ name: req.body.name });
        if (coupon && coupon._id.toString() !== req.params.id) {
          throw new Error('There is already a coupon with this name');
        }
        return true;
      }),
    ),
  check('expire')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid expiration date')
    .custom((val) => {
      const expirationDate = new Date(val);
      if (expirationDate <= new Date()) {
        throw new Error('Expiration date must be in the future');
      }
      return true;
    }),
  check('discount')
    .optional()
    .isNumeric()
    .withMessage('Coupon discount must be a number')
    .isFloat({ min: 1, max: 100 })
    .withMessage('Coupon discount must be between 1 and 100'),
  validatorController.catchError,
];

exports.deleteCouponValidator = [
  check('id').isMongoId().withMessage('Invalid coupon id format.'),
  validatorController.catchError,
];

exports.getCouponValidator = [
  check('id').isMongoId().withMessage('Invalid coupon id format.'),
  validatorController.catchError,
];
