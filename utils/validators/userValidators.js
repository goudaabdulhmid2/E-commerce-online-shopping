const { check } = require('express-validator');
const slugify = require('slugify');
const catchAsync = require('express-async-handler');

const validatorController = require('../../controllers/validatorController');
const User = require('../../models/userModel');

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid user ID'),
  validatorController.catchError,
];

exports.deletetUserValidator = [
  check('id').isMongoId().withMessage('Invalid user ID'),
  validatorController.catchError,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid user ID'),
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(
      catchAsync(async (val) => {
        const user = await User.findOne({ email: val });

        if (user) {
          throw new Error('Email already exists');
        }

        return true;
      }),
    ),
  check('profileImage').optional(),
  check('role').optional(),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage(
      'Please enter a valid phone number! only accept EG or SA phone numbers',
    )
    .custom(
      catchAsync(async (val) => {
        const user = await User.findOne({ phone: val });

        if (user) {
          throw new Error('Phone already exists');
        }

        return true;
      }),
    ),
  validatorController.catchError,
];

exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Too short user name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(
      catchAsync(async (val) => {
        const user = await User.findOne({ email: val });

        if (user) {
          throw new Error('Email already exists');
        }

        return true;
      }),
    ),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Please enter a valid password')
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  check('passwordConfirm')
    .notEmpty()
    .withMessage('PasswordConfirm is required'),
  check('profileImage').optional(),

  check('role').optional(),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage(
      'Please enter a valid phone number! only accept EG or SA phone numbers',
    )
    .custom(
      catchAsync(async (val) => {
        const user = await User.findOne({ phone: val });

        if (user) {
          throw new Error('Phone already exists');
        }

        return true;
      }),
    ),
  validatorController.catchError,
];

exports.changePasswordValidator = [
  check('id').isMongoId().withMessage('invalid user ID.'),
  check('currentPassword')
    .notEmpty()
    .withMessage('Current Password is required'),
  check('passwordConfirm')
    .notEmpty()
    .withMessage('Confirm Password is required.'),
  check('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password too short.')
    .custom(
      catchAsync(async (val, { req }) => {
        const user = await User.findById(req.params.id);

        if (!user) {
          throw new Error('User not found.');
        }

        if (
          user &&
          !(await user.correctPassword(req.body.currentPassword, user.password))
        ) {
          throw new Error('Current Password is incorrect.');
        }

        if (val !== req.body.passwordConfirm) {
          throw new Error('Passwords do not match.');
        }
        return true;
      }),
    ),
  validatorController.catchError,
];
