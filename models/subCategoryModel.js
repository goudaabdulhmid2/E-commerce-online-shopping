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
    images: String,
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

// @desc Query middleware "popualte"
// subCategorySchema.pre(/^find/, function (next) {
//   this.populate({ path: 'category', select: 'name -_id ' });
//   next();
// });

// @desc Pre middleware to create slug
subCategorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
