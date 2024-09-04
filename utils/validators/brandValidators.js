const { check } = require('express-validator');
const validatorController = require('../../controllers/validatorController');

exports.getBrandValidator = [
  check('id').isMongoId().withMessage('Invalid brand ID'),
  validatorController.catchError,
];

exports.createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ min: 2 })
    .withMessage('Name too short.')
    .isLength({ max: 32 })
    .withMessage('Name too long.'),
  validatorController.catchError,
];

exports.updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format.'),
  validatorController.catchError,
];

exports.deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid Brand id format.'),
  validatorController.catchError,
];
