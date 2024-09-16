const express = require('express');

const authController = require('../controllers/authController');
const authValidator = require('../utils/validators/authValidators');

const router = express.Router();

router.post('/signup', authValidator.signupValidator, authController.signup);

router.post('/login', authValidator.loginValidator, authController.login);

router.get('/forgotPassword', authController.forgetPassword);

router.post('/verifyResetCode', authController.verifyResetCode);

router.post(
  '/resetPassword',
  authValidator.resetPasswordValidator,
  authController.resetPassword,
);

module.exports = router;
