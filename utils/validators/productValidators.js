const { check } = require('express-validator');
const validatorController = require('../../controllers/validatorController');

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
    .withMessage('Invalid category ID'),
  check('subCategory')
    .optional()
    .isMongoId()
    .withMessage('Invalid subcategory ID'),
  check('brand').optional().isMongoId().withMessage('Invalid brand ID'),
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
