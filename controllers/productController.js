const catchAsync = require('express-async-handler');
const uuid = require('uuid');
const sharp = require('sharp');

const Product = require('../models/productModel');
const handlerFactory = require('./handlerFactory');

const { uploadMultipleImages } = require('./uploadImageController');

// @desc  Upload product imageCover and images

exports.uploadProductImages = uploadMultipleImages([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (req.files.imageCover) {
    req.files.filename = `product-${uuid.v4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${req.files.filename}`);

    req.body.imageCover = req.files.filename;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, i) => {
        const filename = `product-${uuid.v4()}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(1000, 666)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${filename}`);

        req.body.images.push(filename);
      }),
    );
  }
  next();
});

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
