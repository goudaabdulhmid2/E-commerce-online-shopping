const catchAsync = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/userModel');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc  sign a user
// @route Post /api/v1/auth/signup
// @access Public
exports.signup = catchAsync(async (req, res, next) => {
  // Create
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    profileImage: req.body.profileImage,
  });

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

// @desc  sign in a user
// @route Post /api/v1/auth/login
// @access Public
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password.', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

// @desc  protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // Get token from header or cookie
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } // else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token) {
    return next(new AppError('You are not logged in.', 401));
  }

  // Check if token is valid
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('User no longer exists.', 401));
  }

  // Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User has changed password. Please log in again.', 401),
    );
  }

  req.user = currentUser;
  next();
});

// @desc permissions
exports.restrictTo = (...roels) => {
  return (req, res, next) => {
    if (!roels.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to access this route.', 403),
      );
    }

    next();
  };
};
