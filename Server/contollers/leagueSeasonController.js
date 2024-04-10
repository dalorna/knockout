const LeagueSeason = require('../model/LeagueSeason');

const getLeaguesSeason = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({"message": `Id is required`})
    }
    try {
        const leagueSeason = await LeagueSeason.find({ _id: req.params.id }).exec();
        res.status(200).json(leagueSeason)
    } catch (err) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.me}`})
    }
}

const getLeaguesSeasonByLeagueIdSeasonId = async (req, res) => {
    if (!req?.params?.seasonId || !req?.params?.leagueId) {
        return res.status(400).json({"message": `SeasonId and League Id are required`})
    }
    try {
        const leagueSeason = await LeagueSeason.findOne({
            seasonId: req.params.seasonId,
            leagueId: req.params.leagueId
        }).exec();
        res.status(200).json(leagueSeason)
    } catch (err) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.me}`})
    }
}
const createLeagueSeason = async (req, res) => {
    if (!req?.body?.seasonId || !req?.body?.leagueId) {
        return res.status(400).json({"message": `LeagueId and Season Id are required`})
    }

    try {
        const result = await LeagueSeason.create({
            seasonId: req.body.seasonId,
            leagueId: req.body.leagueId,
            privateCode: !!req.body.privateCode,
            locked: !!req.body.locked,
            rules: {
                canSeePick: req.body.rules?.canSeePick,
                gameType: req.body.rules?.gameType,
                elimination: req.body.rules?.elimination,
                ties: req.body.rules?.ties,
                earlyPoint: req.body.rules?.earlyPoint
            }
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({"message": "Server error attempting to save"})
    }
}
const updateLeagueSeason = async (req, res) => {
    if (!req?.body?._id) {
        return res.status(400).json({"message": `League Season id is required`});
    }
    const leagueSeason = await LeagueSeason.findOne({ _id: req.body._id }).exec();
    if (!leagueSeason) {
        return res.status(204).json({"message": `No Employee matches ID ${req.body._id}`});
    }
    if (req.body?.privateCode) leagueSeason.name = req.body.privateCode;
    if (req.body?.locked) leagueSeason.description = req.body.locked;
    if (req.body?.rules) {
        leagueSeason.rules.canSeePick = req.body.rules?.canSeePick;
        leagueSeason.rules.gameType = req.body.rules?.gameType;
        leagueSeason.rules.elimination = req.body.rules?.elimination;
        leagueSeason.rules.ties = req.body.rules?.ties;
        leagueSeason.rules.earlyPoint = req.body.rules?.earlyPoint;
    }
    try {
        const result = await leagueSeason.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({"message": "Server error attempting to save"})
    }
}
const deleteLeagueSeasonById = async (req, res) => {
    if (!req?.param?.id) {
        return res.status(400).json({"message": "Season Id required"});
    }

    const leagueSeason = await LeagueSeason.findOne({_id : req.param.id}).exec();
    if(!leagueSeason) {
        return res.status(204).json({"message": `No League Season matches ID ${req.param.id}\``});
    }

    try {
        const result = await leagueSeason.deleteOne({_id: req.param.id});
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({"message": "Server error attempting to delete"})
    }

}

module.exports = {
    getLeaguesSeason,
    createLeagueSeason,
    updateLeagueSeason,
    deleteLeagueSeasonById,
    getLeaguesSeasonByLeagueIdSeasonId
}