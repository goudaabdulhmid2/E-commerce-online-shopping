// @desc this class is responsible about opration errors
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    // This allows you to create custom Error objects with stack traces that exclude internal implementation details and provide more relevant information to the developer.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
