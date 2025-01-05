const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AppError = require('../services/appError');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address '],
      validate: {
        validator: async function (email) {
          if (this.isModified('email')) {
            const user = await this.constructor.findOne({ email });
            if (user) return false;
          }
          return true;
        },
        message: 'Email already in use.',
      },
    },
    cellphone: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      match: [
        /^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\d){0,13}\d$/,
        'Please enter a valid international phone number',
      ], // Regex validator for international numbers starting with '+'
      validate: {
        validator: async function (cellphone) {
          if (this.isModified('cellphone')) {
            const user = await this.constructor.findOne({ cellphone });
            if (user) return false;
          }
          return true;
        },
        message: 'Cellphone already in use.',
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    passwordConfirm: {
      type: String,
      required: function () {
        // Make passwordConfirm required only when password is modified
        return this.isModified('password');
      },
      minLength: 8,
      validate: {
        validator: function (passwordConfirm) {
          return passwordConfirm === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    passwordUpdatedAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// VALIDATOR: Require email or phone
userSchema.pre('save', function (next) {
  if (!this.email && !this.cellphone) {
    return next(
      new AppError(
        'Either email or cellphone must be provided for sign up. Please try again.',
        403,
      ),
    );
  }
  return next();
});

// ENCRYPTION: Encrypt user password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only encrypt if password was modified
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
