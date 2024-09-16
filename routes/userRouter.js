const express = require('express');

const userController = require('../controllers/userController');
const userValidator = require('../utils/validators/userValidators');
const authController = require('../controllers/authController');

const router = express.Router();

router.patch(
  '/changePassword/:id',
  userValidator.changePasswordValidator,
  userController.changeUserPassword,
);

router.use(authController.protect);
router
  .route('/')
  .get(authController.restrictTo('admin', 'manager'), userController.getUsers)
  .post(
    authController.restrictTo('admin'),
    userController.uploadProfileImage,
    userController.resizeProfileImage,
    userValidator.createUserValidator,
    userController.creatUser,
  );

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMyPassword',
  userValidator.updateMyPasswordValidator,
  userController.updateMyPassword,
);

router.patch(
  '/updateMe',
  userController.uploadProfileImage,
  userController.resizeProfileImage,
  userValidator.updateMeValidator,
  userController.updateMe,
);

router.use(authController.restrictTo('admin'));
router
  .route('/:id')
  .get(userValidator.getUserValidator, userController.getUser)
  .patch(
    userController.uploadProfileImage,
    userController.resizeProfileImage,
    userValidator.updateUserValidator,
    userController.updateUser,
  )
  .delete(userValidator.deletetUserValidator, userController.deleteUser);

module.exports = router;
