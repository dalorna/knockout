const express = require('express');
const router = express.Router();
const leagueController = require('../../contollers/leagueController');


router.route('/')
    .post(leagueController.createNewLeague)
    .put(leagueController.updateLeague);

router.route('/:userId')
    .get(leagueController.getLeaguesByUserId);

router.route('/:id')
    .delete(leagueController.deleteLeagueById);

module.exports = router;