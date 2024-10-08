const path = require('path');

const express = require('express');
const morgen = require('morgan');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const csrf = require('csurf');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const { webhookCheckout } = require('./controllers/orderController');
const mountRoutes = require('./routes');

const app = express();

// Enaple other domains to access API
app.use(cors());
app.options('*', cors());

// Serving static files from the /uploads directory
app.use(express.static(path.join(__dirname, 'uploads')));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  }),
);

// Parse cookies
app.use(cookieParser());

// Compress all response
app.use(compression());

// General rate limiter for API routes
const limiter = rateLimit({
  window: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again in an 15 minutes!',
});

app.use('/api', limiter);

// Authentication-based rate limiter (login attempts)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req, res) => (req.user ? req.user.id : req.ip),
  message: 'Too many login attempts. Please try again later.',
});

app.use('/api/v1/auth/login', authLimiter);

// Apply data senitization
app.use(mongoSanitize());
app.use(xss());

// Protect against HTTP Parameter Popultion attacks
app.use(
  hpp({
    whitelist: [
      'price',
      'sold',
      'quantity',
      'ratingsAverage',
      'ratingsQuantity',
    ],
  }),
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgen('dev'));
}

// Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout,
);

// Mount Routes
mountRoutes(app);

// Handle unhandlled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find this route ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalErrorHandler);
module.exports = app;
