const catchAsync = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handlerFactory = require('./handlerFactory');
const { getSettings } = require('../utils/settingsCache');
const AppError = require('../utils/AppError');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

exports.setFilterForLoogedUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    req.filterObj = { user: req.user.id };
  }
  next();
};

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

  if (!order) {
    return next(
      new AppError('The order was not created!. something wrong.', 400),
    );
  }

  // After creating order, decrement product quantity, increment product sold
  const bulkOption = cart.cartItems.map((item) => ({
    updateOne: {
      filter: {
        _id: item.product,
      },
      update: {
        $inc: { quantity: -item.quantity, sold: +item.quantity },
      },
    },
  }));

  // bulkWrite send multiple opration to mongoDB
  await Product.bulkWrite(bulkOption, {});

  // clear cart
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// @desc Get orders
// @route GET api/v1/orders
// @access Protected/User/admin/manager
exports.getOrders = handlerFactory.getAll(Order);

// @desc Get spcific order
// @route GET api/v1/orders/:orderId
// @access Protected/User/admin/manager
exports.getOrder = catchAsync(async (req, res, next) => {
  const query = { _id: req.params.orderId };

  // check if role is user
  if (req.user.role === 'user') {
    query.user = req.user.id;
  }

  const order = await Order.findOne(query);

  if (!order) {
    return next(new AppError('There is no order with this ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// @desc update paid status
// @route PATCH api/v1/orders/:orderId/pay
// @access Protected/admin/manager
exports.updateOrderToPaid = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    {
      isPaid: true,
      paidAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!order) {
    return next(new AppError('There is no order with this ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// @desc update delivered status
// @route PATCH api/v1/orders/:orderId/deliver
// @access Protected/admin/manager
exports.updateOrderToDelivered = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    {
      isDelivered: true,
      deliveredAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!order) {
    return next(new AppError('There is no order with this ID.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// @desc Get checkout session from stripe and send as response
// @route GET api/v1/orders/checkout-session
// @access Protected/user
exports.checkOutSession = catchAsync(async (req, res, next) => {
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
  const unitAmount = Math.round(totalOrderPrice * 100);

  // Create strio checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          unit_amount: unitAmount,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: cart.id,
    metadata: req.body.shippingAdress,
  });

  // send session
  res.status(200).json({
    status: 'success',
    data: {
      session,
    },
  });
});

exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    console.log('Create order here ....');
  }
});
