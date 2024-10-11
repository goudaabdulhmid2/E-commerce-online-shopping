const catchAsync = require('express-async-handler');

const User = require('../models/userModel');

// @desc  Add product to wishlist
// @route POST /api/v1/whishlist
// @access Protucted/User
exports.addProductToWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    message: 'Product added to wishlist',
    data: {
      wishlist: user.wishlist,
    },
  });
});

// @desc  Remove product from wishlist
// @route DELETE /api/v1/whishlist
// @access Protucted/User
exports.removeProductFromWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { wishlist: req.params.productId },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    message: 'Product removed from wishlist',
    data: {
      wishlist: user.wishlist,
    },
  });
});

// @desc  Get wishlist
// @route GET /api/v1/whishlist
// @access Protucted/User
exports.getLoggedUserWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'wishlist',
  });

  res.status(200).json({
    status: 'success',
    results: user.wishlist.length,
    data: {
      wishlist: user.wishlist,
    },
  });
});
