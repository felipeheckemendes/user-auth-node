const express = require('express');
const rateLimit = require('express-rate-limit');

const userController = require('../controllers/userController');
const sanitizers = require('../controllers/sanitizers');
const logger = require('../services/logger');

const router = express.Router();

// CONFIGURATIONS
const sanitizeUser = sanitizers.sanitizeBodyBlackList(
  'passwordUpdatedAt', 'createdAt', 'updatedAt', 
  'isActive', '__v', '_id', 'role',
);
const sanitizeAdmin = sanitizers.sanitizeBodyBlackList(
  'passwordUpdatedAt', 'createdAt', 'updatedAt',
  'isActive', '__v', '_id',
);
const rateLimitLogin = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 100, // 60 minutes
  statusCode: 400,
  message: {
    status: 'fail',
    message:"You have exceeded maximum login attemps. Please try again in one hour."}
})
const accessLogger = (req, res, next) => {
  logger.info(`ACCESS REQUEST IP[${req.ip}] URL[${req.originalUrl}] EMAIL[${req.body.email}]`);
  next()
}

// UNAUTHENTICATED ROUTES
router.post('/signup', sanitizeUser, userController.signup);
router.post('/login', sanitizeUser, rateLimitLogin, userController.login);
router.post('/forgotPassword', accessLogger, sanitizeUser, userController.forgotPassword);
router.patch('/resetPassword', sanitizeUser, userController.resetPassword);

// AUTHENTICATED ROUTES
router.use(userController.isAuthenticated);
router.route('/logout').post(sanitizeUser, userController.logout);
router.route('/updatePassword').patch(sanitizeUser, userController.updatePassword);
router.route('/me').get(sanitizeUser, userController.getMe);
router.route('/updateMe').patch(sanitizeUser, userController.updateMe);
router.route('/updateMyEmail').patch(sanitizeUser, userController.updateMyEmail);
router.route('/deactivateMe').patch(sanitizeUser, userController.deactivateMe);
router.route('/deleteMe').delete(sanitizeUser, userController.deleteMe);

// ADMIN ROUTES
router.use(userController.isAuthenticated, userController.restrictTo('admin'), sanitizeAdmin);
router.get('/', userController.getUsers);
router.route('/:id')
      .get(sanitizeAdmin, userController.getUserById)
      .post(sanitizeAdmin, userController.createUser)
      .patch(sanitizeAdmin, userController.updateUser)
      .delete(sanitizeAdmin, userController.deleteUser);

module.exports = router;
