const mongoose = require('mongoose');
const slugify = require('slugify');
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category must have a name.'],
      unique: [true, 'Category must be unique'],
      minlength: [3, 'Name too short.'],
      maxlength: [32, 'Name too long.'],
    },
    slug: String,
    image: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // Create in db updated at and createdat
  },
);

// pre middleware
categorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
