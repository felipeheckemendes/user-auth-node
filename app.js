/* eslint-disable no-console */
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const xssCleaner = require('./services/xssCleaner/xssCleaner');
const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');

// CONFIGURATIONS
const rateLimitGlobal = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 100, // 60 minutes
  statusCode: 400,
  message: {
    status: 'fail',
    message: 'Too many requests from your IP, please try again in an hour',
  },
});
const bodyParserOptions = { limit: '10kb' };
const hppParamPolutionOptions = {
  whitelist: [
    'duration',
    'ratingsAverage',
    'ratingsQuantity',
    'maxGroupSize',
    'difficulty',
    'price',
  ],
};

// EXPRESS - Initialize
const app = express();

// EXPRESS - Global Middlewares
app.use(helmet()); // Safe headers
app.use(express.json(bodyParserOptions)); // Body parser
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined')); // Console logging
app.use('/api', rateLimitGlobal); // Rate limniter for the API
app.use(mongoSanitize()); // Data sanitization against NOSQL query injection
app.use(xssCleaner()); // Data sanitization against cross site scripting attacks
app.use(hpp(hppParamPolutionOptions)); // HPP to prevent HTTP parameter pollution

// EXPRESS - Routes
app.use('/api/v1/users', userRouter);
// 404 error response:
app.all('*', (req, res, next) => {
  return next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
// EXPRESS - Global error controller middleware
app.use(errorController);
// Export app
module.exports = app;
