const express = require('express');

const authController = require('../controllers/authController');
const authValidator = require('../utils/validators/authValidators');

const router = express.Router();

router
  .route('/signup')
  .post(authValidator.signupValidator, authController.signup);

router.route('/login').post(authValidator.loginValidator, authController.login);

module.exports = router;
