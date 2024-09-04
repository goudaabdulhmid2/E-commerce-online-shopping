const handlerFactory = require('./handlerFactory');
const Category = require('../models/categoryModel');

// @desc  Creat category
// @route POST /api/v1/categories
// @access Private
exports.createCategory = handlerFactory.createOne(Category);

// @desc  Get categories
// @route GET /api/v1/categories
// @access Public
exports.getAllCategories = handlerFactory.getAll(Category);

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
