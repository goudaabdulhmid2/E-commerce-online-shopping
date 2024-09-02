const express = require('express');
const morgen = require('morgan');
const AppError = require('./utils/AppError');
const categoryRouter = require('./routes/categoryRouter');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgen('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Mount Routes
app.use('/api/v1/categories', categoryRouter);

// Handle unhandlled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find this route ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalErrorHandler);
module.exports = app;
