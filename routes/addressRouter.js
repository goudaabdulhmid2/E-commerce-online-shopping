const express = require('express');

const addressController = require('../controllers/addressController');
const authController = require('../controllers/authController');
const {
  addAddressValidator,
  removeAddressValidator,
} = require('../utils/validators/addressValidators');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('user'));

router
  .route('/')
  .post(addAddressValidator, addressController.addAdress)
  .get(addressController.getLoggedUserAddresses);

router.delete(
  '/:addressId',
  removeAddressValidator,
  addressController.removeAddress,
);

module.exports = router;
