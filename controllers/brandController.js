const multer = require('multer');
const sharp = require('sharp');
const uuid = require('uuid');

const catchAsync = require('express-async-handler');
const Brand = require('../models/brandModel');
const handlerFactory = require('./handlerFactory');
const { uploadSingleImage } = require('./uploadImageController');

// @desc Upload brand logo
exports.uploadBrandLogo = uploadSingleImage('image');

// @desc Resize and upload brand logo
exports.resizeBrandLogo = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `brand-${uuid.v4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${req.file.filename}`);

  req.body.image = req.file.filename;

  next();
});

// @desc Creat Brand
// @route POST /api/v1/brands
// @access Private
exports.createBrand = handlerFactory.createOne(Brand);

// @desc Get brands
// @route GET /api/v1/brands
// @access Public
exports.getAllBrands = handlerFactory.getAll(Brand, 'Brand');

// @desc Get spcific Brand
// @route GET /api/v1/brands/:id
// @access Public
exports.getBrand = handlerFactory.getOne(Brand);

// @desc Update spcific Brand
// @route PATCH /api/v1/brands/:id
// @access Privet
exports.updateBrand = handlerFactory.updateOne(Brand);

// @desc Delete spcific Brand
// @route DELETE /api/v1/brands/:id
// @access Privet
exports.deleteBrand = handlerFactory.deleteOne(Brand);
