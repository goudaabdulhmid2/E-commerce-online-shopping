const catchAsync = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const SendEmail = require('../utils/SendEmail');
const createSendToken = require('../utils/createToken');

// @desc sign a user
// @route Post /api/v1/auth/signup
// @access Public
exports.signup = catchAsync(async (req, res, next) => {
  // Create
  let user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    profileImage: req.body.profileImage,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new SendEmail(user, url).sendWelcome();
  createSendToken(user, 201, req, res);
});

// @desc sign in a user
// @route Post /api/v1/auth/login
// @access Public
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password.', 401));
  }

  createSendToken(user, 200, req, res);
});

// @desc protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // Get token from header or cookie
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token || token === 'null') {
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

// @desc permissions Authorization
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

// @desc forgot password
// @route GET api/v1/auth/forgotPassword
// @access Public
exports.forgetPassword = catchAsync(async (req, res, next) => {
  // get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There is no user with that email', 404));

  // genrate random code and save in database
  const resetCode = user.createRandomCode();
  await user.save({ validateBeforeSave: false });

  // send email with reset code
  try {
    await new SendEmail(user, resetCode).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Reset password email sent',
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerify = undefined;
    await user.save({ validateBeforeSave: false });

    console.error('Error sending email:', err);
    return next(new AppError('Failed to send email. Try again letter!', 500));
  }
});

// @desc verify reset code
// @route POST api/v1/auth/verifyResetCode
// @access Public
exports.verifyResetCode = catchAsync(async (req, res, next) => {
  // get user based on code
  const hashCode = crypto
    .createHash('sha256')
    .update(req.body.code)
    .digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(new AppError('Reset code is invalid or expired.', 400));

  // verify code
  user.passwordResetVerify = true;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Reset code is valid.',
  });
});

// @desc reset password
// @route POST api/v1/auth/resetPassword
// @access Public
exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on email
  const user = await User.findOne({ email: req.body.email });

  // check if user and verify reset password
  if (!user || !user.passwordResetVerify)
    return next(new AppError('Reset password request is invalid.', 400));

  // update password
  user.password = req.body.password;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerify = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message:
      'Password has been reset successfully. Please log in again with your new password.',
  });
});

// @desc check if user active
exports.isActive = (req, res, next) => {
  if (!req.user.active) {
    return next(new AppError('Your account is inactive.', 403));
  }
  next();
};
