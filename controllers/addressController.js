const catchAsync = require('express-async-handler');

const User = require('../models/userModel');
const AppError = require('../utils/AppError');

// @desc  Add address to user adresses
// @route POST /api/v1/adresses
// @access Protucted/User
exports.addAdress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { addresses: req.body },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    message: 'address added',
    data: {
      addresses: user.addresses,
    },
  });
});

// @desc  Remove adress
// @route DELETE /api/v1/adsresses/:addressId
// @access Protucted/User
exports.removeAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { addresses: { id: req.params.addressId } },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    message: 'Address removed ',
    data: {
      addresses: user.addresses,
    },
  });
});

// @desc  Get adresses
// @route GET /api/v1/addresses
// @access Protucted/User
exports.getLoggedUserAddresses = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('addresses');

  res.status(200).json({
    status: 'success',
    results: user.addresses.length,
    data: {
      addresses: user.addresses,
    },
  });
});
