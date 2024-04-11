const express = require('express');
const router = express.Router();
const leagueSeasonController = require('../../contollers/leagueSeasonController');


router.route('/')
    .post(leagueSeasonController.createLeagueSeason)
    .put(leagueSeasonController.updateLeagueSeason);

router.route('/:id')
    .get(leagueSeasonController.getLeaguesSeason)
    .delete(leagueSeasonController.deleteLeagueSeasonById);

router.route('/:seasonId/:leagueId')
    .get(leagueSeasonController.getLeaguesSeasonByLeagueIdSeasonId);

router.route('/join')
    .post(leagueSeasonController.joinLeague);

router.route('/members')
    .post(leagueSeasonController.getLeaguesByMember);

module.exports = router;