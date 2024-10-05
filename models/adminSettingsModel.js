const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema(
  {
    taxRate: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Settings', adminSettingsSchema);
