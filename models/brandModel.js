const mongoose = require('mongoose');
const slugify = require('slugify');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: [true, 'Brand name already exists'],
      minlength: [2, 'Brand name must be at least 2 characters long'],
      maxlength: [32, 'Brand name must not exceed 32 characters'],
      trim: true,
    },
    image: String,
    slug: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

brandSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Brand', brandSchema);
