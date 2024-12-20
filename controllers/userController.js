const User = require('../models/userModel');

exports.signup = async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    user: user,
  });
};
