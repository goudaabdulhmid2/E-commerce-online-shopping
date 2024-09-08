const { check } = require('express-validator');
const slugify = require('slugify');
const validatorController = require('../../controllers/validatorController');

exports.getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format.'),
  validatorController.catchError,
];

exports.createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category must have a name.')
    .isLength({ min: 3 })
    .withMessage('Name too short.')
    .isLength({ max: 32 })
    .withMessage('Name too long.'),
  validatorController.catchError,
];

exports.updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format.'),
  check('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  validatorController.catchError,
];

exports.deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format.'),
  validatorController.catchError,
];
