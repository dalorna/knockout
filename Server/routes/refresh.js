const express = require('express');
const router = express.Router();
const refreshTokenController = require('../contollers/refreshTokenController');

router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;