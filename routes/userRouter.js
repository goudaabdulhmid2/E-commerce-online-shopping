const express = require('express');

const userController = require('../controllers/userController');
const userValidator = require('../utils/validators/userValidators');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router.patch('/activeMe', userController.activeMe);
router.use(authController.isActive);

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
router.delete('/deleteMe', userController.deleteMe);

// Admin
router.use(authController.restrictTo('admin', 'manager'));
router.patch(
  '/changePassword/:id',
  userValidator.changePasswordValidator,
  userController.changeUserPassword,
);

router
  .route('/')
  .get(userController.getUsers)
  .post(
    userController.uploadProfileImage,
    userController.resizeProfileImage,
    userValidator.createUserValidator,
    userController.creatUser,
  );

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
