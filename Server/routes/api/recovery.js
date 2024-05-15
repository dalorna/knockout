const express = require('express');
const recoveryController = require('../../contollers/recoveryController');
const router = express.Router();

router.route('/')
    .post(recoveryController.emailSend);

router.route('/username')
    .post(recoveryController.usernameEmailSend);

module.exports = router;
