const express = require('express');
const router = express.Router();
const pickController = require('../../contollers/pickController');

router.route('/')
    .post(pickController.createPick)
    .put(pickController.updatePick);

router.route('/:weekId')
    .post(pickController.getPick)

module.exports = router;