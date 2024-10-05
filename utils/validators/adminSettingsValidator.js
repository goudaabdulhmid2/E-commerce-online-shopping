const { check } = require('express-validator');

const validatorController = require('../../controllers/validatorController');

exports.updateTaxAndShippingPriceValidator = [
  check('taxRate')
    .optional()
    .isFloat({ min: 1, max: 100 })
    .withMessage('taxRate discount must be between 1 and 100'),
  check('shippingPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('shippingPrice must be positive number.'),
  validatorController.catchError,
];
