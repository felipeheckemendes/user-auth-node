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
  if (err instanceof AppError) console.error('=> PROGRAMMING ERROR', err);
  res.status(err.statusCode).json({
    status: err instanceof AppError ? err.status : 'error',
    message: err instanceof AppError ? err.message : 'Something went wrong',
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
