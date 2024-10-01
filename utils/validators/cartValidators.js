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
    .withMessage('Invalid product id.')
    .custom(
      catchAsync(async (val, { req }) => {
        const product = await Product.findById(val);

        if (!product) throw new AppError('Product not found', 404);

        const colorExist = product.colors.find((el) => el === req.body.color);

        if (!colorExist) new AppError("This color doesn't exist.", 400);

        return true;
      }),
    ),
  validatorController.catchError,
];

exports.removeItemFromCartValidator = [
  check('itemId')
    .isMongoId()
    .withMessage('Invalid item id.')
    .custom(
      catchAsync(async (val, { req }) => {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
          throw new Error('There is no cart for this user.');
        }

        const itemExists = cart.cartItems.some((item) => item.id === val);

        if (!itemExists) {
          throw new Error('Item not found in cart.');
        }
        return true;
      }),
    ),
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
