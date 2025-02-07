class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = this.statusCode.toString().startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor); // Exclude constructor function from the error call stack trace
  }
}

module.exports = AppError;
