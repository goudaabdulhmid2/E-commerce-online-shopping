const Brand = require('../models/brandModel');
const handlerFactory = require('./handlerFactory');

// @desc  Creat Brand
// @route POST /api/v1/brands
// @access Private
exports.createBrand = handlerFactory.createOne(Brand);

// @desc  Get brands
// @route GET /api/v1/brands
// @access Public
exports.getAllBrands = handlerFactory.getAll(Brand);

// @desc  Get spcific Brand
// @route GET /api/v1/brands/:id
// @access Public
exports.getBrand = handlerFactory.getOne(Brand);

// @desc  Update spcific Brand
// @route PATCH /api/v1/brands/:id
// @access Privet
exports.updateBrand = handlerFactory.updateOne(Brand);

// @desc  Delete spcific Brand
// @route DELETE /api/v1/brands/:id
// @access Privet
exports.deleteBrand = handlerFactory.deleteOne(Brand);
