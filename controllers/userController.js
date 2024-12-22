const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const createAndSendToken = (statusCode, user, res) => {
  const payload = {
    id: user._id,
    iat: Math.floor(Date.now() / 1000 - 10),
    exp: Math.floor(Date.now() / 1000 + 60 * 24 * process.env.JWT_EXPIRES_DAYS),
  };
  const token = jwt.sign(payload, process.env.JWTSECRET);
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
