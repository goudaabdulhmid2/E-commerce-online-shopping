const express = require('express');

const productController = require('../controllers/productController');
const productValidator = require('../utils/validators/productValidators');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

// @desc Nested route for reviews under product
router.use('/:productId/reviews', reviewRouter);

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productValidator.createProductValidator,
    productController.createProduct,
  )
  .get(productController.getAllProducts);

router
  .route('/:id')
  .get(productValidator.getProductValidator, productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productValidator.updateProductValidator,
    productController.updateProduct,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productValidator.deleteProductValidator,
    productController.deleteProduct,
  );

module.exports = router;
