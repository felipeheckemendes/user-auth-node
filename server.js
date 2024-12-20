/* eslint-disable no-console */
const process = require('process');
const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routes/userRoutes');

// CONFIGURATIONS
dotenv.config({ path: path.join(__dirname, '/.env'), encoding: 'utf8', debug: false });
const isDevelopment = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 3000;
const database = isDevelopment ? process.env.DEV_DATABASE : process.env.PROD_DATABASE;
const databasePassword = isDevelopment
  ? process.env.DEV_DATABASE_PASSWORD
  : process.env.PROD_DATABASE_PASSWORD;

// DATABASE CONNECTION
const DBString = database.replace('<db_password>', databasePassword);
mongoose
  .connect(DBString, {
    autoIndex: isDevelopment, // On production, indexes should be created directly on DB
    serverSelectionTimeoutMS: 5000, // Exit fast when DB is unresponsive
  })
  .then(() => {
    console.log('Mongo DB connection successfull.\n');
  })
  .catch((err) => {
    console.error('Mongo DB connection failed:\n', err);
  });

// EXPRESS
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

// EXPRESS - Start server
app.listen(port, () => {
  console.log(`Server started and running on port ${port}.\n`);
});
