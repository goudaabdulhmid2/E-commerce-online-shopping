const express = require('express');
const subCategoryController = require('../controllers/subCategoryController');
const subCategoryValidator = require('../utils/validators/subCategoryValidator');

// @desc margePrams: Allows us to access the parent category id from the URL
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    subCategoryController.setCategoryFilter,
    subCategoryController.getSubCatgories,
  )
  .post(
    subCategoryController.uploadSubCategoryImages,
    subCategoryController.resizeImages,
    subCategoryController.setCategoryIds,
    subCategoryValidator.createSubcategoryValidator,
    subCategoryController.createSubCategory,
  );

router
  .route('/:id')
  .get(
    subCategoryValidator.getSubcategoryValidator,
    subCategoryController.getSubCategory,
  )
  .patch(
    subCategoryController.uploadSubCategoryImages,
    subCategoryController.resizeImages,
    subCategoryValidator.updateSubcategoryValidator,
    subCategoryController.updateSubCategory,
  )
  .delete(
    subCategoryValidator.deleteSubcategoryValidator,
    subCategoryController.deleteSubCategory,
  );

module.exports = router;
