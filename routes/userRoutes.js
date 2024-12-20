const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

// prettier-ignore
router
    .route('/signup')
    .post(userController.signup);

module.exports = router;
