const express = require('express');
const router = express.Router();
const logoutController = require('../contollers/logoutController');

router.get('/', logoutController.handleLogout);

module.exports = router;