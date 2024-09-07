const Product = require('../models/productModel');
const handlerFactory = require('./handlerFactory');

// @desc  Creat Product
// @route POST /api/v1/products
// @access Private
exports.createProduct = handlerFactory.createOne(Product);

// @desc  Get Products
// @route GET /api/v1/products
// @access Public
exports.getAllProducts = handlerFactory.getAll(Product, 'Product');

// @desc  Get spcific Product
// @route GET /api/v1/products/:id
// @access Public
exports.getProduct = handlerFactory.getOne(Product);

// @desc  Update spcific Product
// @route PATCH /api/v1/products/:id
// @access Privet
exports.updateProduct = handlerFactory.updateOne(Product);

// @desc  Delete spcific Product
// @route DELETE /api/v1/products/:id
// @access Privet
exports.deleteProduct = handlerFactory.deleteOne(Product);
