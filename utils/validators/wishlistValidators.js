const { check } = require('express-validator');
const catchAsync = require('express-async-handler');

const validatorController = require('../../controllers/validatorController');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');

exports.addProductToWishlistValidator = [
  check('productId')
    .isMongoId()
    .withMessage('Invalid product id.')
    .custom(
      catchAsync(async (val, { req }) => {
        const product = await Product.findById(val);
        if (!product) {
          throw new Error('Product not found.');
        }
        return true;
      }),
    ),
  validatorController.catchError,
];

exports.removeProductFromWishlistValidator = [
  check('productId')
    .isMongoId()
    .withMessage('Invalid product id')
    .custom(
      catchAsync(async (val, { req }) => {
        const user = await User.findById(req.user.id);

        if (!user) {
          throw new Error('User not found');
        }

        if (!user.wishlist.includes(val)) {
          throw new Error('Product is not in the wishlist');
        }
        return true;
      }),
    ),
  validatorController.catchError,
];
