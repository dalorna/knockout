const express = require('express');
const router = express.Router();
const authController = require('../contollers/authController');

router.post('/', authController.handleLogin);

router.get('/user', authController.handleGetUser)

module.exports = router;