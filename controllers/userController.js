const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const AppError = require('../utils/appError');

function validateToken(token) {
  try {
    if (!token) {
      return false; // No token provided
    }

    // Attempt to verify the token
    jwt.verify(token, process.env.JWTSECRET);
    return true; // Token is valid
  } catch (error) {
    return false; // Verification failed
  }
}

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
  try {
    const user = await User.create(req.body);
    createAndSendToken(201, user, res);
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
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
  } catch (err) {
    return next(err);
  }
};

exports.isAuthenticated = async (req, res, next) => {
  try {
    // If authentication header is present, try to get the Bearer Token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
      token = req.headers.authorization.split(' ')[1];
    // Check if JWT Bearer Token was sent on headers and is valid
    if (!token || !validateToken(token))
      return next(
        new AppError('You are not logged in. Please log in to access this resource', 401),
      );
    // Decode token and find user
    const tokenPayload = jwt.decode(token);
    const user = await User.findById(tokenPayload.id);
    // Check if  user still exists
    if (!user)
      return next(
        new AppError('You are not logged in. Please log in to access this resource', 401),
      );

    // Check if token has expired -> Not necessary since jwt.verify already checks for expiry
    // if (!tokenPayload.exp || !tokenPayload.iat || Date(tokenPayload.exp * 1000) < Date.now())
    // return next(new AppError('You are not logged in. Please log in to access this resource', 401));

    // Check if user has changed password after token issued
    if (user.passwordUpdatedAt && user.passwordUpdatedAt > Date(tokenPayload.iat * 1000))
      return next(new AppError('You need to login again after changing your password', 401));
    // If all checks have passed, add user to request, and go to next middleware
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    // Check if request body is well-formed
    if (!req.body.currentPassword || !req.body.newPassword || !req.body.newPasswordConfirm)
      return next(
        new AppError(
          'Please provide both currentPassword, newPassword and newPasswordConfirm in order to reset password',
          400,
        ),
      );

    // Check if password and passwordConfirm match (This could rely on the model validator, but I chose to check here also)
    if (req.body.newPassword !== req.body.newPasswordConfirm)
      return next(new AppError('New passwords do not match. Please try again', 400));

    // Find user on DB
    const user = await User.findById(req.user.id).select('+password');

    // Check if current password is correct for the authenticated user
    const isPasswordCorrect = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isPasswordCorrect)
      return next(
        new AppError(
          'Your current password is incorrect. Please provide the correct current password in order to reset password',
          400,
        ),
      );

    // If so, update password and passwordUpdatedAt
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    user.passwordUpdatedAt = Date.now() - 1000;
    await user.save();

    // Send new login token
    createAndSendToken(200, user, res);
  } catch (err) {
    next(err);
  }
};

// Test to implement: another user is loggedin, and forges a request with another user on the req.body, and tries to update the other user's password. Should not be allowed
