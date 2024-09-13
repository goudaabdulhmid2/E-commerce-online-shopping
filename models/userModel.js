const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },
    slug: String,
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
      lowercase: true,
    },
    phone: {
      type: String,
      unique: [true, 'Phone number already exists'],
    },
    profileImage: String,
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

userSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.virtual('imgUrl').get(function () {
  return this.profileImage
    ? `${process.env.BASE_URL}/users/${this.profileImage}`
    : '';
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

module.exports = mongoose.model('User', userSchema);
