const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Coupon name is required.'],
      unique: [true, 'Coupon name is unique.'],
      minlength: [3, 'Coupon name must be at least 3 characters long.'],
      maxlength: [32, 'Coupon name must not exceed 32 characters.'],
    },
    expire: {
      type: Date,
      required: [true, 'Coupon expiration date is required.'],
    },
    discount: {
      type: Number,
      required: [true, 'Coupon discount percentage is required.'],
      min: [1, 'Coupon discount percentage must be at least 1.'],
      max: [100, 'Coupon discount percentage must not exceed 100.'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

couponSchema.pre('save', function (next) {
  this.name = this.name.toUpperCase();
  next();
});

module.exports = mongoose.model('Coupon', couponSchema);
