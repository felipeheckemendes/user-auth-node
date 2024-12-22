/* eslint-disable no-console */
const express = require('express');

const userRouter = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');

// EXPRESS - Initialize
const app = express();

// EXPRESS - General Middleware
app.use(express.json({ limit: '10kb' })); // Body parser

// EXPRESS - Routes
app.use('/api/v1/users', userRouter);
// 404 error response:
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});
// EXPRESS - Global error controller middleware
app.use(errorController);
// Export app
module.exports = app;
