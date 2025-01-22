/* eslint-disable no-console */
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');

const xssCleaner = require('./services/xssCleaner');
const AppError = require('./services/appError');
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
const corsOptions = {
  sorigin: 'http://localhost:5173',
  // origin:
  //   process.env.NODE_ENV === 'development'
  //     ? process.env.DEV_FRONTEND_URL
  //     : process.env.PROD_FRONTEND_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: false,
};

// EXPRESS - Initialize
const app = express();

// EXPRESS - Global Middlewares
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
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
