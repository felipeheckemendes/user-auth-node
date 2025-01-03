const express = require('express');

const userController = require('../controllers/userController');
const sanitizers = require('../controllers/sanitizers');

const router = express.Router();

router.use(
  sanitizers.sanitizeBodyBlackList(
    'passwordUpdatedAt',
    'createdAt',
    'updatedAt',
    'isActive',
    '__v',
    '_id',
    'role',
  ),
);
// prettier-ignore
router
    .route('/signup')
    .post(userController.signup);
// prettier-ignore
router
    .route('/login')
    .post(userController.login);
// prettier-ignore
router
    .route('/forgotPassword')
    .post(userController.forgotPassword);
// prettier-ignore
router
    .route('/resetPassword')
    .patch(userController.resetPassword);
// prettier-ignore
router
    .route('/updatePassword')
    .patch(userController.isAuthenticated, userController.updatePassword);
// prettier-ignore
router
    .route('/me')
    .get(userController.isAuthenticated, userController.getMe);
// prettier-ignore
router
    .route('/updateMe')
    .patch(userController.isAuthenticated, userController.updateMe);
// prettier-ignore
router
    .route('/deactivateMe')
    .patch(userController.isAuthenticated, userController.deactivateMe);

module.exports = router;
