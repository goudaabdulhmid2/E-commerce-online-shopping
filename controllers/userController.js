const sharp = require('sharp');
const catchAsync = require('express-async-handler');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const handlerFactory = require('./handlerFactory');
const User = require('../models/userModel');
const { uploadSingleImage } = require('./uploadImageController');
const AppError = require('../utils/AppError');
const createSendToken = require('../utils/createToken');

// @desc  Upload profile image for user
exports.uploadProfileImage = uploadSingleImage('profileImage');

// @desc  Resize and upload profile image for user
exports.resizeProfileImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${uuid.v4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${req.file.filename}`);
  req.body.profileImage = req.file.filename;

  next();
});

// @desc  Create new user
// @route POST /api/v1/users
// @access Private
exports.creatUser = handlerFactory.createOne(User);

// @desc  Update user
// @route PATCH  /api/v1/users/:id
// @access Private
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role,
      slug: req.body.slug,
      phone: req.body.phone,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    doc: user,
  });
});

exports.changeUserPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  user.password = req.body.password;

  // hash will be in pre middleware
  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// @desc  Delete user
// @route DELETE  /api/v1/users/:id
// @access Private
exports.deleteUser = handlerFactory.deleteOne(User);

// @desc  Get user by ID
// @route GET /api/v1/users/:id
// @access Private
exports.getUser = handlerFactory.getOne(User);

// @desc  Get all users
// @route GET /api/v1/users
// @access Private
exports.getUsers = handlerFactory.getAll(User);

// @desc  Get my data
// @route GET /api/v1/users/me
// @access Private/protect
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// @desc  Updat  my password
// @route PATCH /api/v1/users/updateMyPassword
// @access Private/protect
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  user.password = req.body.password;

  // hash will be in pre middleware
  await user.save();

  createSendToken(user, 200, req, res);
});

// @desc  Updat Me
// @route PATCH /api/v1/users/updateMe
// @access Private/protect
exports.updateMe = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
      profileImage: req.body.profileImage,
      slug: req.body.slug,
      phone: req.body.phone,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updateUser) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

// @desc  Delete Me
// @route DELETE /api/v1/users/deleteMe
// @access Private/protect
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user.id,
    {
      active: false,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// @desc  Active Me
// @route PATCH /api/v1/users/activeMe
// @access Private/protect
exports.activeMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { active: true },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});
