const express = require('express');

const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.protect, authController.restrictTo('user'));

router
  .route('/')
  .get(cartController.getUserCart)
  .post(cartController.addProductToCart);

router.route('/:itemId').delete(cartController.removeItemFromCart);

module.exports = router;
