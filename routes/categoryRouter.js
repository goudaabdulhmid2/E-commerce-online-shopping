const express = require('express');

const categoryController = require('../controllers/categoryController');
const categoryValidator = require('../utils/validators/categoryValidators');
const subCategoryRouter = require('./subCategoryRouter');
const authController = require('../controllers/authController');

const router = express.Router();

// @desc Nested router for subcategories under a category
router.use('/:categoryId/subcategories', subCategoryRouter);

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    categoryController.uploadCategoryImage,
    categoryController.resizeCategoryImage,
    categoryValidator.createCategoryValidator,
    categoryController.createCategory,
  );

router
  .route('/:id')
  .get(categoryValidator.getCategoryValidator, categoryController.getCategory)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    categoryController.uploadCategoryImage,
    categoryController.resizeCategoryImage,
    categoryValidator.updateCategoryValidator,
    categoryController.updateCategory,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    categoryValidator.deleteCategoryValidator,
    categoryController.deleteCategory,
  );
module.exports = router;
