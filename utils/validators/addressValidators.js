const { check } = require('express-validator');
const catchAsync = require('express-async-handler');

const validatorController = require('../../controllers/validatorController');
const User = require('../../models/userModel');

exports.addAddressValidator = [
  check('alias')
    .optional()
    .isString()
    .withMessage('Alias must be a string')
    .custom(
      catchAsync(async (val, { req }) => {
        const user = await User.findById(req.user.id);

        if (!user) {
          throw new Error('User not found');
        }

        const aliasDublicate = user.addresses.some(
          (address) => address.alias === val,
        );

        if (aliasDublicate) {
          throw new Error('Alias already exists');
        }
        return true;
      }),
    ),
  check('details')
    .optional()
    .isString()
    .withMessage('Details must be a string'),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage(
      'Please enter a valid phone number! only accept EG or SA phone numbers',
    ),
  check('city').optional().isString().withMessage('City must be a string'),
  check('postalCode')
    .optional()
    .isPostalCode('any')
    .withMessage('Please provide a valid postal code'),
  validatorController.catchError,
];

exports.removeAddressValidator = [
  check('addressId')
    .optional()
    .isMongoId()
    .withMessage('Invalid address id')
    .custom(
      catchAsync(async (val, { req }) => {
        const user = await User.findById(req.user.id);

        if (!user) {
          throw new Error('User not found');
        }

        const addressExists = user.addresses.some(
          (address) => address._id.toString() === val,
        );

        if (!addressExists) {
          throw new Error('Address not found');
        }
        return true;
      }),
    ),
  validatorController.catchError,
];
