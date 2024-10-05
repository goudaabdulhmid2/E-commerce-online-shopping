const express = require('express');

const settingsController = require('../controllers/adminSettingsController');
const auhtController = require('../controllers/authController');
const {
  updateTaxAndShippingPriceValidator,
} = require('../utils/validators/adminSettingsValidator');

const router = express.Router();

router.use(
  auhtController.protect,
  auhtController.restrictTo('admin', 'manager'),
);
router.patch(
  '/updateTaxAndShippingPrice',
  updateTaxAndShippingPriceValidator,
  settingsController.updateTaxAndShippingPrice,
);

module.exports = router;
