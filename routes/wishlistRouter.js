const express = require('express');

const wishlistController = require('../controllers/wishlistController');
const authController = require('../controllers/authController');
const {
  addProductToWishlistValidator,
  removeProductFromWishlistValidator,
} = require('../utils/validators/wishlistValidators');

const router = express.Router();
router.use(authController.protect, authController.restrictTo('user'));

router
  .route('/')
  .post(addProductToWishlistValidator, wishlistController.addProductToWishlist)
  .get(wishlistController.getLoggedUserWishlist);

router.delete(
  '/:productId',
  removeProductFromWishlistValidator,
  wishlistController.removeProductFromWishlist,
);

module.exports = router;
