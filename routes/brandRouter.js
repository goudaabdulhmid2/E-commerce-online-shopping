const express = require('express');

const brandController = require('../controllers/brandController');
const brandValidators = require('../utils/validators/brandValidators');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(brandController.getAllBrands)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    brandController.uploadBrandLogo,
    brandController.resizeBrandLogo,
    brandValidators.createBrandValidator,
    brandController.createBrand,
  );

router
  .route('/:id')
  .get(brandValidators.getBrandValidator, brandController.getBrand)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    brandController.uploadBrandLogo,
    brandController.resizeBrandLogo,
    brandValidators.updateBrandValidator,
    brandController.updateBrand,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    brandValidators.deleteBrandValidator,
    brandController.deleteBrand,
  );

module.exports = router;
