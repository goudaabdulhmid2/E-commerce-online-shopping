const express = require('express');

const orderController = require('../controllers/orderController');
const {
  createOrderValidator,
  getOrderValidators,
  updateOrderToPaidValidators,
  updateOrderToDeliverValidator,
} = require('../utils/validators/ordersValidators');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(orderController.setFilterForLoogedUser, orderController.getOrders)
  .post(
    authController.restrictTo('user'),
    createOrderValidator,
    orderController.createOrder,
  );

router.route('/:orderId').get(getOrderValidators, orderController.getOrder);

router
  .route('/:orderId/pay')
  .patch(
    authController.restrictTo('admin', 'manager'),
    updateOrderToPaidValidators,
    orderController.updateOrderToPaid,
  );

router
  .route('/:orderId/deliver')
  .patch(
    authController.restrictTo('admin', 'manager'),
    updateOrderToDeliverValidator,
    orderController.updateOrderToDelivered,
  );
module.exports = router;
