const League = require('../model/League');

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
        const result = await League.create({
            userId: req.body.userId,
            name: req.body.name,
            description: req.body.description
        });
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

module.exports = {
    getLeaguesByUserId,
    createNewLeague,
    updateLeague,
    deleteLeagueById
}