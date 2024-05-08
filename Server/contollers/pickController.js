const Pick = require('../model/Pick');
const Season = require('../model/Season');
const LeagueSeason = require('../model/LeagueSeason')

const getPick = async (req, res) => {
    if (!req?.body?.userId || !req?.body?.leagueSeasonId || !req?.params?.weekId) {
        return res.status(400).json({"message": `userId, leagueSeasonId, and weekId are required`})
    }
    try {
        const pick = await Pick.find({
            userId: req.body.userId,
            weekId: req.params.weekId,
            leagueSeasonId: req.body.leagueSeasonId
        }).exec();

        res.status(200).json(pick)
    } catch (err) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.me}`})
    }
}
const createPick = async (req, res) => {
    if (!req?.body?.userId || !req?.body?.leagueSeasonId || !req?.body?.weekId
        || !req?.body?.gameId || !req?.body?.teamId ) {
        return res.status(400).json({"message": `Malformed Request`})
    }
    try {
        //need to stop from picking same team if in knockout or loser and can't pick same
        const currentSeason = await Season.findOne({isCurrent: true}, null, null);
        const currentWeek = currentSeason.weeks.find(f => f.id === (req.body.weekId - 1));

        if ((new Date()).getTime() > (new Date(currentWeek.firstGameDate)).getTime()) {
            res.statusMessage ="To late to make the pick!"
            return res.sendStatus(400).end();
        }

        const result = await Pick.create({
            userId: req.body.userId,
            username: req.body.username,
            weekId: req.body.weekId,
            leagueSeasonId: req.body.leagueSeasonId,
            teamId: req.body.teamId,
            gameId: req.body.gameId,
            locked: req.body.locked
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({"message": "Server error attempting to save"})
    }
}
const updatePick = async (req, res) => {
    if (!req?.body?.userId || !req?.body?.leagueSeasonId || !req?.body?.weekId
        || !req?.body?.gameId || !req?.body?.teamId ) {
        return res.status(400).json({"message": `Malformed Request`})
    }

    //need to stop from picking same team if in knockout or loser and can't pick same
    const currentSeason = await Season.findOne({isCurrent: true}, null, null);
    const currentWeek = currentSeason.weeks.find(f => f.id === (req.body.weekId - 1));

    if ((new Date()).getTime() > (new Date(currentWeek.firstGameDate)).getTime()) {
        res.statusMessage ="To late to make the pick!"
        return res.sendStatus(400).end();
    }

    const pick = await Pick.findOne({ _id: req.body.id }).exec();
    if (!pick) {
        return res.status(204).json({"message": `No Pick found for this user, league, and week`});
    }
    if (req.body?.teamId) pick.teamId = req.body.teamId;
    if (req.body?.gameId) pick.gameId = req.body.gameId;
    pick.locked = req.body?.locked;

    try {
        const result = await pick.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({"message": "Server error attempting to save"})
    }
}
const picksByWeek = async (req, res) => {
    if (!req?.params?.leagueSeasonId || !req?.params?.weekId) {
        return res.status(400).json({"message": `leagueSeasonId, and weekId are required`})
    }
    try {
        const picks = await Pick.find({
            weekId: req.params.weekId,
            leagueSeasonId: req.params.leagueSeasonId
        }).exec();

        res.status(200).json(picks)
    } catch (err) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.me}`})
    }
}
const getPicksByUser = async (req, res) => {
    if (!req?.params?.userId || !req?.params?.leagueSeasonId ) {
        return res.status(400).json({"message": `userId, leagueSeasonId are required`})
    }
    try {
        const pick = await Pick.find({
            userId: req.params.userId,
            leagueSeasonId: req.params.leagueSeasonId
        }).exec();

        res.status(200).json(pick)
    } catch (err) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.me}`})
    }
}
const getPicksByUserAllLeagues = async (req, res) => {
    if (!req?.params?.userId || !req.body?.weekId || !req?.body?.leagueIds || !req.body.seasonId ) {
        return res.status(400).json({"message": `userId, weekId, seasonId, and leagueSeasonId are required`})
    }
    try {
        const leagueSeasons = await LeagueSeason.find({
            seasonId: req.body.seasonId,
            leagueId: { $in: req.body.leagueIds}
        }, null, null).exec();
        const picks = await Pick.find({
            userId: req.params.userId,
            weekId: req.body.weekId,
            leagueSeasonId: { $in: leagueSeasons.map(m => m._id.toString())}
        }, null, null).exec();

        const userPicks = [];
        for (const pick of picks) {
            const ls = leagueSeasons.find(f => f._id.toString() === pick.leagueSeasonId);
            let p = JSON.parse(JSON.stringify(pick));
            p.leagueId = ls.leagueId.toString();
            userPicks.push(p);
        }

        res.status(200).json({userPicks, leagueSeasons})
    } catch (err) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.me}`})
    }
}

module.exports = {
    getPick,
    createPick,
    updatePick,
    picksByWeek,
    getPicksByUser,
    getPicksByUserAllLeagues
}
