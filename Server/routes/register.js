const express = require('express');
const router = express.Router();
const registerController = require('../contollers/registerController');

router.post('/', registerController.handleNewUser);
router.post('/reset', registerController.resetPassword);

module.exports = router;