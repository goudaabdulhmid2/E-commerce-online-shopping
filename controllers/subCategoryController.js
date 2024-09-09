const sharp = require('sharp');
const uuid = require('uuid');
const catchAsync = require('express-async-handler');

const handlerFactory = require('./handlerFactory');
const SubCategory = require('../models/subCategoryModel');
const { uploadMultipleImages } = require('./uploadImageController');

// @desc  Upload multiple images for subcategory
exports.uploadSubCategoryImages = uploadMultipleImages([
  { name: 'images', maxCount: 5 },
]);

// @desc  Resize images before upload
exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();

  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (img, i) => {
      const filename = `subcategory-${uuid.v4()}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(img.buffer)
        .resize(1000, 666)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/subcategories/${filename}`);

      req.body.images.push(filename);
    }),
  );

  next();
});

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
