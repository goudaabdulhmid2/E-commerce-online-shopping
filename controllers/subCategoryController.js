const handlerFactory = require('./handlerFactory');
const SubCategory = require('../models/subCategoryModel');

// @desc  Set category ids in request body come from nested route
exports.setCategoryIds = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;

  next();
};

// @desc  Set category filter in request body come from nested route
exports.setCategoryFilter = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId };
  req.filterObj = filterObj;
  next();
};

// @desc  get categories
// @route GET /api/v1/subCategories
// @access Public
exports.getSubCatgories = handlerFactory.getAll(SubCategory, 'SubCategory');

// @desc  get category
// @route GET /api/v1/subCategories
// @access Public
exports.getSubCategory = handlerFactory.getOne(SubCategory);

// @desc  Creat category
// @route POST /api/v1/subCategories
// @access Private
exports.createSubCategory = handlerFactory.createOne(SubCategory);

// @desc  Update category
// @route PATCH /api/v1/subCategories
// @access Private
exports.updateSubCategory = handlerFactory.updateOne(SubCategory);

// @desc  Delete category
// @route Delete /api/v1/subCategories
// @access Private
exports.deleteSubCategory = handlerFactory.deleteOne(SubCategory);
