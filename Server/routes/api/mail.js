const express = require('express');
const mailController = require('../../contollers/mailController');
const router = express.Router();

router.route('/')
    .post(mailController.emailSend);

module.exports = router;