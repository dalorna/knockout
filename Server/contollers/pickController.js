const Pick = require('../model/Pick');

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
        const result = await Pick.create({
            userId: req.body.userId,
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

module.exports = {
    getPick,
    createPick,
    updatePick
}
