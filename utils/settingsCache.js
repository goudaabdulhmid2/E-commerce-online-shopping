const catchAsync = require('express-async-handler');

const Settings = require('../models/adminSettingsModel');
const client = require('../config/redisClient');

exports.getSettings = catchAsync(async () => {
  const cachedSettings = await client.get('settings');

  if (cachedSettings) {
    // if settings are cached, return them
    return JSON.parse(cachedSettings);
  } else {
    // if no cached settings, fetch from database
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }

    await client.set('settings', JSON.stringify(settings), {
      EX: process.env.CACHE_EXPIRATION_TIME,
    });

    return settings;
  }
});
