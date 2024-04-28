const express = require('express');
const router = express.Router();
const processWeekController = require('../../contollers/processWeekController');


router.route('/')
    .post(processWeekController.processWeekByLeagueSeasonId);

router.route('/setFalse/:leagueSeasonId')
    .get(processWeekController.setProcessedToFalse);



module.exports = router;