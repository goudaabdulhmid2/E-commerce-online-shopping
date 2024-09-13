const express = require('express');

const userController = require('../controllers/userController');
const userValidator = require('../utils/validators/userValidators');

const router = express.Router();

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
