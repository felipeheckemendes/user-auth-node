/* eslint-disable no-console */
const process = require('process');
const AppError = require('../utils/appError');

// HELPER FUNCTIONS
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  // Sanitize expected errors. If AppError, no sanitization necessary
  let sanitizedError;
  if (err instanceof AppError) {
    sanitizedError = { ...err };
  } else if (err.name === 'CastError') {
    sanitizedError = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  } else if (err.code === 11000) {
    sanitizedError = new AppError(
      `Duplicate field value ${err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]}. Please another value`,
      400,
    );
  } else if (err.name === 'ValidationError') {
    sanitizedError = new AppError(
      `Invalid input data. ${Object.values(err.errors)
        .map((error) => error.message)
        .join('. ')}`,
      400,
    );
  } else {
    // If unexpected error, log to console and generate a generic message
    console.error('=> PROGRAMMING ERROR', err);
    sanitizedError = { status: 'error', message: 'Something went wrong', statusCode: 500 };
  }

  // Send error response to client.
  res.status(sanitizedError.statusCode).json({
    status: sanitizedError.status,
    message: sanitizedError.message,
  });
};

// GLOBAL ERROR HANDLER
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Something went wrong';
  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  else sendErrorProd(err, res);
};
