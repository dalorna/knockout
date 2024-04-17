const express = require('express');
const router = express.Router();
const leagueController = require('../../contollers/leagueController');
const verifyLeague = require('../../middleware/verifyLeague');


router.route('/')
    .post(leagueController.createNewLeague)
    .put(verifyLeague(), leagueController.updateLeague);

router.route('/:userId')
    .get(leagueController.getLeaguesByUserId);

router.route('/:id')
    .delete(verifyLeague(), leagueController.deleteLeagueById);

router.route('/member')
    .post(leagueController.getLeaguesByLeagueIds)

module.exports = router;