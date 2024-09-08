const { check } = require('express-validator');
const mongoose = require('mongoose');
const slugify = require('slugify');
const validatorController = require('../../controllers/validatorController');
const Category = require('../../models/categoryModel');
const Subcategory = require('../../models/subCategoryModel');
const Brand = require('../../models/brandModel');

exports.getProductValidator = [
  check('id').isMongoId().withMessage('Invalid product ID'),
  validatorController.catchError,
];

exports.deleteProductValidator = [
  check('id').isMongoId().withMessage('Invalid product ID'),
  validatorController.catchError,
];

exports.updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid product ID'),
  check('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  validatorController.catchError,
];

exports.createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength(3, 100)
    .withMessage('Title must be between 3 and 100'),
  check('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),
  check('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isNumeric()
    .withMessage('Quantity must be a number'),
  check('sold').optional().isNumeric().withMessage('Sold must be a number'),
  check('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Price after discount must be a number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value)
        throw new Error('Price after discount must be lower than price');
      return true;
    }),
  check('colors').optional().isArray().withMessage('Colors must be an array'),
  check('imageCover').notEmpty().withMessage('Image cover is required'),
  check('images').optional().isArray().withMessage('Images must be an array'),
  check('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID')
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) throw new Error('No category with this ID found');
      return true;
    }),
  check('subCategories')
    .optional()
    .isArray()
    .withMessage('subCategories must be an array')
    .custom(async (value, { req }) => {
      // Check if there are duplicate subcategory IDs in the array
      const dublicateIds = new Set(value);
      if (dublicateIds.size !== value.length) {
        throw new Error('there are duplicate subcategory IDs');
      }

      // Check if all provided subcategory IDs are valid
      const invalidIds = value.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id),
      );

      if (invalidIds.length) {
        throw new Error(`Invalid subcategory IDs: ${invalidIds.join(', ')}`);
      }

      // check if all provided subcategories ids are in database
      const result = await Subcategory.find({
        _id: { $exists: true, $in: value },
      });

      if (result.length !== value.length)
        throw new Error(`Some subcategories were not found`);

      // Check if each provided subcategory is associated with the given category
      const subcategories = await Subcategory.find({
        category: req.body.category,
      });

      const subcategoryIds = subcategories.map((subcategory) =>
        subcategory._id.toString(),
      );

      result.forEach((subcategory) => {
        if (!subcategoryIds.includes(subcategory._id.toString())) {
          throw new Error(
            `${subcategory.name} is not associated with the provided category`,
          );
        }
      });

      return true;
    }),
  check('brand')
    .optional()
    .isMongoId()
    .withMessage('Invalid brand ID')
    .custom(async (value) => {
      const brand = await Brand.findById(value);
      if (!brand) throw new Error('No brand with this ID found');
      return true;
    }),
  check('ratingsAvarage')
    .optional()
    .isNumeric()
    .withMessage('Rating average must be a number')
    .isLength(1, 5)
    .withMessage('Rating average must be between 1 and 5'),
  check('rating')
    .optional()
    .isNumeric()
    .withMessage('Rating must be a number')
    .isLength({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('Rating quantity must be a number'),
  validatorController.catchError,
];
