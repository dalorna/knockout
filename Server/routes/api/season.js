const express = require('express');
const router = express.Router();
const seasonController = require('../../contollers/sesaonController');
const verifyRole = require('../../middleware/verifyRoles');
const ROLES = require('../../config/roles_list');

router.route('/')
    .get(seasonController.getCurrentSeason)
    .post(verifyRole(ROLES.SA), seasonController.createNewSeason)
    .put(verifyRole(ROLES.SA), seasonController.updateCurrentYear);

router.route('/week')
    .put(verifyRole(ROLES.SA), seasonController.updateCurrentWeek);

router.route('/archive')
    .get(seasonController.getLastTenSeason);

module.exports = router;