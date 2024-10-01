const express = require('express');

const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');
const {
  addProductToCartValidator,
  removeItemFromCartValidator,
  updateCartItemQuantityValidator,
} = require('../utils/validators/cartValidators');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('user'));

router
  .route('/')
  .get(cartController.getUserCart)
  .post(addProductToCartValidator, cartController.addProductToCart)
  .delete(cartController.clearCart);

router.patch('/applyCoupon', cartController.applyCoupon);

router
  .route('/:itemId')
  .delete(removeItemFromCartValidator, cartController.removeItemFromCart)
  .patch(
    updateCartItemQuantityValidator,
    cartController.updateCartItemQuantity,
  );

module.exports = router;
