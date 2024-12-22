/* eslint-disable no-console */
const process = require('process');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
    console.error('❌ Mongo DB connection failed:\n', err);
  });

// EXPRESS - Start server
app.listen(port, () => {
  console.log(`✅ Server started and running on port ${port}.\n`);
});
