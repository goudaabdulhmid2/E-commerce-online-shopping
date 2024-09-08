const multer = require('multer');
const uuid = require('uuid');
const sharp = require('sharp');

const { uploadSingleImage } = require('./uploadImageController');
const catchAsync = require('express-async-handler');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');
const Category = require('../models/categoryModel');

// @desc  Upload category image
exports.uploadCategoryImage = uploadSingleImage('image');

// @desc  Resize category image
exports.resizeCategoryImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `category-${uuid.v4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${req.file.filename}`);

  req.body.image = req.file.filename;

  next();
});

// @desc  Creat category
// @route POST /api/v1/categories
// @access Private
exports.createCategory = handlerFactory.createOne(Category);

// @desc  Get categories
// @route GET /api/v1/categories
// @access Public
exports.getAllCategories = handlerFactory.getAll(Category, 'Category');

// @desc  Get spcific category
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = handlerFactory.getOne(Category);

// @desc  Update spcific category
// @route PATCH /api/v1/categories/:id
// @access Privet
exports.updateCategory = handlerFactory.updateOne(Category);

// @desc  Delete spcific category
// @route DELETE /api/v1/categories/:id
// @access Privet
exports.deleteCategory = handlerFactory.deleteOne(Category);
