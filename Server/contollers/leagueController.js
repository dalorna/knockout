const League = require('../model/League');
const User = require('../model/User');

const getLeaguesByUserId = async (req, res) => {
    if (!req?.params?.userId) {
        return res.status(400).json({"message": `User id is required`})
    }
    try {
        const league = await League.find({ userId: req.params.userId }).exec();

        res.status(200).json(league)
    } catch (err) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.me}`})
    }
}
const createNewLeague = async (req, res) => {
    if (!req?.body?.name || !req?.body?.userId) {
        return res.status(400).json({"message": `User id is required`})
    }
    try {
        const foundUser = await User.findOne({_id: req.body.userId}, null, null).exec();
        if (foundUser.leagues.filter(f => !f.paid) > 0) {
            res.statusMessage('You already have 1 unpaid private league created');
            return res.sendStatus(400).json({"message": `You're only allowed 1 unpaid private league`})
        }
        if (!foundUser) {
            return res.sendStatus(401); //Unauthorized
        }
        const result = await League.create({
            userId: req.body.userId,
            name: req.body.name,
            description: req.body.description
        });
        foundUser.leagues.push({leagueId: result._id, Paid: !!req?.body.paid});
        try {
            await foundUser.save();
        } catch (err) {
            res.statusMessage = err.message;
            return res.sendStatus(500);
        }
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({"message": "Server error attempting to save"})
    }
}
const updateLeague = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({"message": `League id is required`});
    }
    const league = await League.findOne({ _id: req.body.id }).exec();
    if (!league) {
        return res.status(204).json({"message": `No League matches ID ${req.body.id}`});
    }
    if (req.body?.name) league.name = req.body.name;
    if (req.body?.description) league.description = req.body.description;
    try {
        const result = await league.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({"message": "Server error attempting to save"})
    }
}
const deleteLeagueById = async (req, res) => {
    if (!req?.param?.id) {
        return res.status(400).json({"message": "League Id required"});
    }

    const league = await League.findOne({_id : req.param.id}).exec();
    if(!league) {
        return res.status(204).json({"message": `No League matches ID ${req.param.id}\``});
    }
    
    try {
        const result = await league.deleteOne({_id: req.param.id});
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({"message": "Server error attempting to delete"})
    }

}
const getLeaguesByLeagueIds = async (req, res) => {
    if (!req?.body?.leagueIds){
        return res.status(400).json({"message": `No League Ids`})
    }
    try {
        const leagues = await League.find({ _id: {$in: req.body.leagueIds } }).exec();
        res.status(200).json(leagues)
    } catch (err) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.me}`})
    }
}

module.exports = {
    getLeaguesByUserId,
    createNewLeague,
    updateLeague,
    deleteLeagueById,
    getLeaguesByLeagueIds
}