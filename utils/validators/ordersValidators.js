const { check } = require('express-validator');

const validatorController = require('../../controllers/validatorController');

exports.createOrderValidator = [
  check('sippingAdress.details')
    .optional()
    .isString()
    .withMessage('Details must be a string'),
  check('sippingAdress.phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage(
      'Please enter a valid phone number! only accept EG or SA phone numbers',
    ),
  check('sippingAdress.city')
    .optional()
    .isString()
    .withMessage('City must be a string'),
  check('sippingAdress.postalCode')
    .optional()
    .isPostalCode('any')
    .withMessage('Please provide a valid postal code'),
  validatorController.catchError,
];

exports.getOrderValidators = [
  check('orderId').isMongoId().withMessage('Invalid order Id.'),
  validatorController.catchError,
];

exports.updateOrderToPaidValidators = [
  check('orderId').isMongoId().withMessage('Invalid order Id.'),
  validatorController.catchError,
];

exports.updateOrderToDeliverValidator = [
  check('orderId').isMongoId().withMessage('Invalid order Id.'),
  validatorController.catchError,
];
