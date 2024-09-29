const path = require('path');

const express = require('express');
const morgen = require('morgan');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const mountRoutes = require('./routes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgen('dev'));
}

// Serving static files from the /uploads directory
app.use(express.static(path.join(__dirname, 'uploads')));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Mount Routes
mountRoutes(app);

// Handle unhandlled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find this route ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalErrorHandler);
module.exports = app;
