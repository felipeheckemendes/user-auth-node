const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const AppError = require('../utils/appError');

const createAndSendToken = (statusCode, user, res) => {
  const payload = {
    id: user._id,
    iat: Math.floor(Date.now() / 1000 - 10),
    exp: Math.floor(Date.now() / 1000 + 60 * 24 * process.env.JWT_EXPIRES_DAYS),
  };
  const token = jwt.sign(payload, process.env.JWTSECRET);

  const cookieOptions = {};
  cookieOptions.expires = new Date(Date.now() + process.env.JWT_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
  cookieOptions.httpOnly = true; // This restricts cookie to the browser
  cookieOptions.secure = process.env.NODE_ENV !== 'development'; // Cookie is sent only on https if not in production

  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: user,
  });
};

exports.signup = async (req, res, next) => {
  const user = await User.create(req.body);
  createAndSendToken(201, user, res);
};

exports.login = async (req, res, next) => {
  // Check if user provided either email or cellphone
  if (!req.body.email && !req.body.cellphone) {
    const errMessage =
      'No email or cellphone number provided. Please provide at least one in order to login';
    return next(new AppError(errMessage, 400));
  }
  // Check if user provided password
  if (!req.body.password) {
    const errMessage = 'No password provided. Please provide password in order to login';
    return next(new AppError(errMessage, 400));
  }
  // Find user either using email or cellphone
  let user;
  if (req.body.email) user = await User.findOne({ email: req.body.email }).select('+password');
  else if (req.body.cellphone)
    user = await User.findOne({ cellphone: req.body.cellphone }).select('+password');
  // Check if email/cellphone and password provided are valid
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    const errMessage = 'Email/cellphone or password are not valid. Please try again.';
    return next(new AppError(errMessage, 400));
  }
  // Send JWT token back to user
  createAndSendToken(201, user, res);
};
