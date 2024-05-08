const express = require('express');
const router = express.Router();
const pickController = require('../../contollers/pickController');

router.route('/')
    .post(pickController.createPick)
    .put(pickController.updatePick);

router.route('/:weekId')
    .post(pickController.getPick);

router.route('/:leagueSeasonId/:weekId')
    .get(pickController.picksByWeek);

router.route('/:leagueSeasonId/user/:userId')
    .get(pickController.getPicksByUser);

router.route('/all/user/:userId')
    .post(pickController.getPicksByUserAllLeagues);

module.exports = router;