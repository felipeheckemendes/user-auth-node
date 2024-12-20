const mongoose = require('mongoose');

const AppError = require('../utils/appError');

const userSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
  email: {
    type: String,
    index: true,
    unique: true,
    sparse: true,
    lowercase: true,
    validate: {
      validator: async function (email) {
        const user = await this.constructor.findOne({ email });
        if (user) return false;
      },
      message: 'Email already in use.',
    },
  },
  cellphone: {
    type: String,
    index: true,
    unique: true,
    sparse: true,
    match:
      /^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\d){0,13}\d$/, // Regex validator for international numbers starting with '+'
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (passwordConfirm) {
        return passwordConfirm === this.password;
      },
      message: 'Passwords do not match',
    },
  },
});

// VALIDATOR: Require email or phone
userSchema.pre('save', function (req, res, next) {
  if (!this.email && !this.phone) {
    return next(
      new AppError('Either email or cellphone must be provided for sign up. Please try again.'),
    );
  }
  return next();
});

const User = mongoose.Model('User', userSchema);
module.exports = User;
