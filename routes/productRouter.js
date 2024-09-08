const express = require('express');

const productController = require('../controllers/productController');
const productValidator = require('../utils/validators/productValidators');

const router = express.Router();

router
  .route('/')
  .post(
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
    productController.uploadProductImages,
    productController.resizeProductImages,
    productValidator.updateProductValidator,
    productController.updateProduct,
  )
  .delete(
    productValidator.deleteProductValidator,
    productController.deleteProduct,
  );

module.exports = router;
