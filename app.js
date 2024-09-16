const path = require('path');

const express = require('express');
const morgen = require('morgan');

const AppError = require('./utils/AppError');
const categoryRouter = require('./routes/categoryRouter');
const subCategoryRouter = require('./routes/subCategoryRouter');
const brandRouter = require('./routes/brandRouter');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const reviewRouter = require('./routes/reviewRouter');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgen('dev'));
}

// Serving static files from the /uploads directory
app.use(express.static(path.join(__dirname, 'uploads')));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Mount Routes
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/subcategories', subCategoryRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/reviews', reviewRouter);

// Handle unhandlled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find this route ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalErrorHandler);
module.exports = app;
