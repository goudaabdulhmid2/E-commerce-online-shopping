const express = require('express');
const categoryController = require('../controllers/categoryController');
const categoryValidator = require('../utils/validators/categoryValidators');
const subCategoryRouter = require('./subCategoryRouter');

const router = express.Router();

// @desc Nested router for subcategories under a category
router.use('/:categoryId/subcategories', subCategoryRouter);

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(
    categoryValidator.createCategoryValidator,
    categoryController.createCategory,
  );

router
  .route('/:id')
  .get(categoryValidator.getCategoryValidator, categoryController.getCategory)
  .patch(
    categoryValidator.updateCategoryValidator,
    categoryController.updateCategory,
  )
  .delete(
    categoryValidator.deleteCategoryValidator,
    categoryController.deleteCategory,
  );
module.exports = router;
