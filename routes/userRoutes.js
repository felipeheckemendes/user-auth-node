// prettier-ignore
const express = require('express');

const userController = require('../controllers/userController');
const sanitizers = require('../controllers/sanitizers');

const router = express.Router();

const sanitizeUser = sanitizers.sanitizeBodyBlackList(
  'passwordUpdatedAt', 'createdAt', 'updatedAt', 
  'isActive', '__v', '_id', 'role',
);
const sanitizeAdmin = sanitizers.sanitizeBodyBlackList(
  'passwordUpdatedAt', 'createdAt', 'updatedAt',
  'isActive', '__v', '_id',
);

// UNAUTHENTICATED ROUTES
router.post('/signup', sanitizeUser, userController.signup);
router.post('/login', sanitizeUser, userController.login);
router.post('/forgotPassword', sanitizeUser, userController.forgotPassword);
router.patch('/resetPassword', sanitizeUser, userController.resetPassword);

// AUTHENTICATED ROUTES
router.use(userController.isAuthenticated);
router.route('/updatePassword').patch(sanitizeUser, userController.updatePassword);
router.route('/me').get(sanitizeUser, userController.getMe);
router.route('/updateMe').patch(sanitizeUser, userController.updateMe);
router.route('/deactivateMe').patch(sanitizeUser, userController.deactivateMe);

module.exports = router;
