const catchAsync = require('express-async-handler');

const Settings = require('../models/adminSettingsModel');
const client = require('../config/redisClient');

// @desc  Update tax and shipping price
// @route PATCH api/v1/admin-settings/updateTaxAndShippingPrice
// @access Protucted/Admin/Manager
exports.updateTaxAndShippingPrice = catchAsync(async (req, res, next) => {
  let settings = await Settings.findOne({});

  if (!settings) {
    settings = await Settings.create({});
  }

  settings.taxRate = req.body.taxRate / 100 || settings.taxRate;

  settings.shippingPrice = req.body.shippingPrice || settings.shippingPrice;

  await settings.save();

  await client.set('settings', JSON.stringify(settings), {
    EX: process.env.CACHE_EXPIRATION_TIME,
  });

  res.status(200).json({
    status: 'success',
    data: settings,
  });
});
