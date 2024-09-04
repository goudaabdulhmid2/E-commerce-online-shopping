const express = require('express');
const brandController = require('../controllers/brandController');
const brandValidators = require('../utils/validators/brandValidators');

const router = express.Router();

router
  .route('/')
  .get(brandController.getAllBrands)
  .post(brandValidators.createBrandValidator, brandController.createBrand);

router
  .route('/:id')
  .get(brandValidators.getBrandValidator, brandController.getBrand)
  .patch(brandValidators.updateBrandValidator, brandController.updateBrand)
  .delete(brandValidators.deleteBrandValidator, brandController.deleteBrand);

module.exports = router;
