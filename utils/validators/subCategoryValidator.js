const { check } = require('express-validator');
const validatorController = require('../../controllers/validatorController');

exports.getSubcategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Subcategory id format.'),
  validatorController.catchError,
];

exports.createSubcategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Subcategory must have a name.')
    .isLength({ min: 2 })
    .withMessage('Name too short.')
    .isLength({ max: 32 })
    .withMessage('Name too long.'),
  check('category')
    .notEmpty()
    .withMessage('Subcategory must belong to a category.')
    .isMongoId()
    .withMessage('Invalid Category id format.'),
  validatorController.catchError,
];

exports.updateSubcategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Subcategory id format.'),
  validatorController.catchError,
];

exports.deleteSubcategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Subcategory id format.'),
  validatorController.catchError,
];
