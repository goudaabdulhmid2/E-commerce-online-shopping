const catchAsync = require('express-async-handler');

const AppError = require('../utils/AppError');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const { getSettings } = require('../utils/settingsCache');

// @desc Create cash order
// @route POST api/v1/orders
// @access Protected/User
exports.createOrder = catchAsync(async (req, res, next) => {
  // app settings
  const settings = await getSettings();

  // Get cart depend on logged-in user
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new AppError('Cart not found for this user.', 404));
  }

  // Get order price depend on cart price
  const cartPrice = cart.totalPriceAfterDiscount || cart.totalPrice;
  const taxPrice = settings.taxRate * cartPrice;
  const shippingPrice = settings.shippingPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // Create Order with default paymenMethodeType cash
  const order = await Order.create({
    user: req.user.id,
    cartItems: cart.cartItems,
    shippingAdress: req.body.shippingAdress,
    taxPrice,
    shippingPrice,
    totalOrderPrice,
  });
});
