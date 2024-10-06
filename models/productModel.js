const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title must not exceed 100 characters long'],
    },
    slug: String,
    description: {
      type: String,
      required: ['true', 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters long'],
    },
    quantity: {
      default: 0,
      required: [true, 'Quantity is required'],
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    priceAfterDiscount: Number,
    colors: [String],
    imageCover: {
      type: String,
      required: [true, 'Image cover is required'],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Subcategory',
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating average must be between 1 and 5'],
      max: [5, 'Rating average must be between 1 and 5'],
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

// @desc queary middleware to populate category
productSchema.pre(/^find/, function (next) {
  this.populate({ path: 'category', select: 'name -_id' });
  next();
});

productSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

productSchema.virtual('imageCoverUrl').get(function () {
  return this.imageCover
    ? `${process.env.BASE_URL}/products/${this.imageCover}`
    : '';
});

productSchema.virtual('imagesUrls').get(function () {
  if (!this.images?.length) return [];
  return this.images?.map(
    (image) => `${process.env.BASE_URL}/products/${image}`,
  );
});

module.exports = mongoose.model('Product', productSchema);
