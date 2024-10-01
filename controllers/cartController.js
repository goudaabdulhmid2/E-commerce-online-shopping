const catchAsync = require('express-async-handler');

const AppError = require('../utils/AppError');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');

const calcTotalPrice = (cart) => {
  const total = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  cart.totalPrice = total;
  if (cart.coupon) {
    cart.totalPriceAfterDiscount = Math.max(
      0,
      (total - (total * cart.coupon) / 100).toFixed(2),
    );
  } else {
    cart.totalPriceAfterDiscount = undefined;
  }
};

const checkCartExists = async (userId, next) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new AppError('No cart found for this user', 404);
  return cart;
};

// @dsec add product to cart
// @route POST api/v1/car
// @access protected/User
exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  // check if product exists
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // check if color exist
  const colorExist = product.colors.find((el) => el === color);
  if (!colorExist) {
    return next(new AppError("This color doesn't exist.", 400));
  }

  // Get cart for user
  let cart = await Cart.findOne({ user: req.user.id });

  // check if cart exists
  if (!cart) {
    // create a new cart with the new product
    cart = await Cart.create({
      user: req.user.id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    // check if product is already in the cart
    const existingItem = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color,
    );
    if (existingItem > -1) {
      // increase quantity of the existing item
      cart.cartItems[existingItem].quantity++;
      // update price of the existing item
      cart.cartItems[existingItem].price = product.price;
    } else {
      // add new product to the cart
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }

  // update total price
  calcTotalPrice(cart);

  await cart.save();

  res.status(200).json({ status: 'success', data: { cart } });
});

// @dsec get cart
// @route GET api/v1/cart
// @access protected/User
exports.getUserCart = catchAsync(async (req, res, next) => {
  const cart = await checkCartExists(req.user.id, next);

  res.status(200).json({
    status: 'success',
    numberOfItems: cart.cartItems.length,
    data: {
      cart,
    },
  });
});

// @dsec delete item
// @route Delete api/v1/cart/:itemId
// @access protected/User
exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const cart = await checkCartExists(req.user.id, next);

  const itemExists = cart.cartItems.some(
    (item) => item.id === req.params.itemId,
  );

  if (!itemExists) {
    return next(new AppError('Item not found in cart.', 404));
  }

  cart.cartItems = cart.cartItems.filter(
    (item) => item.id !== req.params.itemId,
  );

  calcTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Item removed.',
    numberOfItems: cart.cartItems.length,
    data: {
      cart,
    },
  });
});

// @dsec clear all item
// @route Delete api/v1/cart
// @access protected/User
exports.clearCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user.id });

  if (!cart) {
    return next(new AppError('There is no cart for this user.', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// @dsec update quantity
// @route update api/v1/cart/:itemId
// @access protected/User
exports.updateCartItemQuantity = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await checkCartExists(req.user.id, next);

  const itemIndex = cart.cartItems.findIndex(
    (item) => item.id === req.params.itemId,
  );

  if (itemIndex < 0) {
    return next(new AppError('There is no item for this id.', 404));
  }

  cart.cartItems[itemIndex].quantity = quantity;
  calcTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: 'success',
    numberOfItems: cart.cartItems.length,
    data: {
      cart,
    },
  });
});

// @dsec apply coupon
// @route PATCH api/v1/cart/applyCoupon
// @access protected/User
exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { coupon } = req.body;
  const couponExist = await Coupon.findOne({
    name: coupon,
    expire: { $gt: Date.now() },
  });

  if (!couponExist) {
    return next(new AppError('Invalid or expired coupon.', 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart || cart.cartItems.length === 0) {
    return next(
      new AppError('There is no cart or cart is empty for this user.', 404),
    );
  }

  cart.coupon = couponExist.discount;
  calcTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    numberOfItems: cart.cartItems.length,
    data: {
      totalPrice: cart.totalPrice,
      totalPriceAfterDiscount: cart.totalPriceAfterDiscount,
    },
  });
});
