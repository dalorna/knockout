const LeagueSeason = require('../model/LeagueSeason');
const User = require('../model/User');
const League = require('../model/League');

const getLeaguesSeason = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({"message": `Id is required`})
    }
    try {
        const leagueSeason = await LeagueSeason.find({ _id: req.params.id }).exec();
        res.status(200).json(leagueSeason)
    } catch (err) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.message}`})
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
        res.status(500).json({"message": `Server error attempting to get\r ${err.message}`})
    }
}
const createLeagueSeason = async (req, res) => {
    if (!req?.body?.seasonId || !req?.body?.leagueId) {
        return res.status(400).json({"message": `LeagueId and Season Id are required`})
    }

    try {
        const code = req.body.privateCode.length === 0 ? 'false' : req.body.privateCode;
        const result = await LeagueSeason.create({
            seasonId: req.body.seasonId,
            leagueId: req.body.leagueId,
            privateCode: code,
            locked: !!req.body.locked,
            maxMembers: req.body.maxMembers,
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
        return res.status(400).json({"message": `Season id is required`});
    }
    const leagueSeason = await LeagueSeason.findOne({ _id: req.body._id }).exec();
    if (!leagueSeason) {
        return res.status(204).json({"message": `No Season ID ${req.body._id}`});
    }
    if (req.body?.privateCode) leagueSeason.name = req.body.privateCode;
    leagueSeason.locked = req.body.locked;
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
const joinLeague = async (req, res) => {
    if (!req?.body?.leagueId) {
        return res.status(400).json({"message": `League Season id is required`});
    }
    if (!req?.body?.member) {
        return res.status(400).json({"message": `No Members attached`});
    }
    let leagueSeason;
    try {
        leagueSeason = await LeagueSeason.findOne({ leagueId: req.body.leagueId }).exec();
        if (!leagueSeason) {
            leagueSeason = await LeagueSeason.findOne({ privateCode: req.body.leagueId }).exec();
            if (!leagueSeason) {
                res.statusMessage = "No League Found";
                return res.sendStatus(400).end();
            }
        }

        if (!leagueSeason.locked) {
            res.statusMessage = "The rules for this league are not locked, and you may not join."
            return res.sendStatus(204).end();
        }

    } catch (e) {
        res.statusMessage = "Error Attempting to save";
        return res.sendStatus(500).end();
    }

    try {
        const currentMember = leagueSeason.members.find(m => m.userId === req.body.member.userId);
        if (!currentMember) {
            if(leagueSeason.members && leagueSeason.members.length > 0) {
                leagueSeason.members.push(req.body.member)
            } else {
                leagueSeason.members = [req.body.member];
            }
            const result = await leagueSeason.save();
            res.status(201).json(result);
        } else {
            res.statusMessage = "You've already joined this league"
            return res.sendStatus(204).end();
        }

    } catch (err) {
        res.statusMessage = "Error Attempting to save";
        res.status(500).end();
    }
}
const getLeaguesByMember = async (req, res) => {
    if (!req?.body?.member) {
        return res.status(400).json({"message": `No Members attached`});
    }
    try {
        const result = await LeagueSeason.find({
            'members.userId': req.body.member.userId
        }).exec();
        res.status(200).json(result);

    } catch (err) {
        res.statusMessage = "Error Getting Leagues";
        res.status(500).end();
    }

}
const getLeagueMemberUsers = async (req, res) => {
    if (!req?.params?.seasonId || !req?.params?.leagueId) {
        res.statusMessage = 'LeagueId and SeasonId are required';
        return res.sendStatus(400).json({"message": `LeagueId and SeasonId are required`});
    }

    try {
        const league = await League.findOne({
            _id: req.params.leagueId
        }).exec();

        const leagueSeason = await LeagueSeason.findOne({
            leagueId: req.params.leagueId,
            seasonId: req.params.seasonId
        }).exec();

        if (league?.userId && leagueSeason?.members) {
            const members = leagueSeason.members.map(m => m.userId);
            members.push(league.userId);
            const users = await User.find({
                _id: {$in: members}
            }).exec();

            res.status(200).json(users);
        } else {
            res.statusMessage = "No league or users found";
            res.status(204).end();
        }

    } catch (err) {
        res.statusMessage = "Error Getting users";
        res.status(500).end();
    }
}
const getOpenLeagues = async (req, res) => {
    if (!req?.params?.page || !req?.query?.userId) {
        return res.status(400).json({"message": `Page and member id are required`});
    }
    const recordsPerPage = 3;
    const page = req.params.page;
    const skip = recordsPerPage * page;

    try {
        const leagueSeasons = await LeagueSeason.find(
            {
                locked: true,
                privateCode: 'false',
                'members.userId': {$ne: req.query.userId},
                'members.24': {$exists: false}
            },
            null,
            {
                skip: skip,
                limit: recordsPerPage,
                sort: {_id: 1}
            }).exec();
        const count = await LeagueSeason.countDocuments({
            locked: true,
            privateCode: 'false',
            'members.userId': {$ne: req.query.userId},
            'members.24': {$exists: false}
        }).exec()
        const leagueIds = leagueSeasons.map(m => m.leagueId);
        const leagues = await League.find({
         _id: {$in: leagueIds }
        }).exec();
        const result = {leagueSeasons, leagues, count};
        res.status(200).json(result);
    } catch (err) {
        res.statusMessage = err.message; //"Error Getting Leagues";
        res.status(500).end();
    }

}

const getLeaguesSeasonsBySeasonId = async (req, res) => {
    if (!req?.params?.seasonId) {
        return res.status(400).json({"message": `SeasonId is required`})
    }
    try {
        const leagueSeasons = await LeagueSeason.find({ seasonId: req.params.seasonId }, null, null).exec();
        res.status(200).json(leagueSeasons)
    } catch (err) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.message}`})
    }
}

module.exports = {
    getLeaguesSeason,
    createLeagueSeason,
    updateLeagueSeason,
    deleteLeagueSeasonById,
    getLeaguesSeasonByLeagueIdSeasonId,
    joinLeague,
    getLeaguesByMember,
    getLeagueMemberUsers,
    getOpenLeagues
}