const { check } = require('express-validator');
const catchAsync = require('express-async-handler');

const validatorController = require('../../controllers/validatorController');
const Product = require('../../models/productModel');
const Cart = require('../../models/cartModel');

exports.addProductToCartValidator = [
  check('color').notEmpty().withMessage('Color is required.'),
  check('productId')
    .notEmpty()
    .withMessage('Product id is required.')
    .isMongoId()
    .withMessage('Invalid product id.'),
  validatorController.catchError,
];

exports.removeItemFromCartValidator = [
  check('itemId').isMongoId().withMessage('Invalid item id.'),
  validatorController.catchError,
];

exports.updateCartItemQuantityValidator = [
  check('itemId').isMongoId().withMessage('Invalid item id.'),
  check('quantity')
    .notEmpty()
    .withMessage('Quantity is required.')
    .isNumeric()
    .withMessage('Quantity must be number.'),
  validatorController.catchError,
];
