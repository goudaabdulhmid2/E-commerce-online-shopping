const mongoose = require('mongoose');
const slugify = require('slugify');

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, 'Subcategory must have a name.'],
      unique: [true, 'Subcategory must be unique'],
      minlength: [2, 'Name is too short.'],
      maxlength: [32, 'Name is too long.'],
    },
    slug: String,
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      require: [true, 'Subcategory must be belong to parent category.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

// @desc Pre middleware to create slug
subCategorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

subCategorySchema.virtual('urlImages').get(function () {
  if (this.images.length === 0) return [];
  return this.images.map(
    (image) => `${process.env.BASE_URL}/subcategories/${image}`,
  );
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
