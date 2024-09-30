const catchAsync = require('express-async-handler');

const AppError = require('../utils/AppError');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const calcTotalPrice = (cart) => {
  cart.totalPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
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
      (item) => item.product === productId && item.color === color,
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
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new AppError('There is no cart for this user.', 404));
  }

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
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    {
      cartItems: { $pull: { _id: req.params.itemId } },
    },
    {
      new: true,
    },
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
