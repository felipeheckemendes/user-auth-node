/* eslint-disable no-console */
const process = require('process');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// EXCEPTION HANDLING FILTER: Globally handle synchronous exceptions not otherwise handled
process.on('uncaughtException', (err) => {
  console.error('=> UNHANDLED EXCEPTION:');
  console.error(err.name, err.message, err);
  process.exit(1);
});

// LOAD MAIN APPLICATION
const app = require('./app');

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
    console.log('✅ Mongo DB connection successfull.\n');
  })
  .catch((err) => {
    console.error('❌ Mongo DB connection failed.\n');
    console.error(err.name, err.message);
  });

// EXPRESS - Start server
const server = app.listen(port, () => {
  console.log(`✅ Server started and running on port ${port}.\n`);
});

// REJECTION HANDLING FILTER: Globally handle asynchronous promise rejections not handled otherwise by Express
process.on('unhandledRejection', (err) => {
  console.error('=> UNHANDLED REJECTION:');
  console.error(err.name, err.message, err);
  server.close(() => {
    console.log('=> SERVER CLOSED. Shutting down after unhandled rejection...');
    process.exit(1);
  });
});
