const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

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
    .route('/updatePassword')
    .patch(userController.isAuthenticated, userController.updatePassword);

module.exports = router;
