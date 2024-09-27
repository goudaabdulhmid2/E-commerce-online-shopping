const mongoose = require('mongoose');
const slugify = require('slugify');

const Product = require('./productModel');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      required: [true, 'Review rating required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user.'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to product.'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Ensure each user can only leave one review per product
reviewSchema.index(
  {
    user: 1,
    product: 1,
  },
  { unique: true },
);

// populate
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name profileImage' });
  next();
});

// aggrations
reviewSchema.statics.calcAvrageRatingsAndQuantity = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        ratingsQuantity: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].ratingsQuantity,
      ratingsAverage: stats[0].avgRatings,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// post middleware for create
reviewSchema.post('save', async function () {
  await this.constructor.calcAvrageRatingsAndQuantity(this.product);
});

// pre middleware for update and delete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.model.findOne(this.getQuery());
  next();
});

// post middleware for update and delete
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAvrageRatingsAndQuantity(this.r.product);
});

module.exports = mongoose.model('Review', reviewSchema);
