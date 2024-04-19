const Season = require('../model/Season');


//get last 10 seasons
const getLastTenSeason = async (req, res) => {

}
//get current season
const getCurrentSeason = async (req, res) => {

}
//insert season
const createNewSeason = async (req, res) => {
    if (!req?.body.year) {
        return res.status(400).json({"message": `Year is required`})
    }
    try {
        const foundYear = await Season.findOne({year: req.body.year}, null, null).exec();
        if (foundYear) {
            res.statusMessage = `${req.body.year} already exists`;
            return res.sendStatus(400);
        }
        const result = await Season.create(
            {
                year: req.body.year,
                weeks: weeks
            }
        )
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({"message": "Server error attempting to save"})
    }
}
//update isCurrentYear
const updateCurrentYear = async (req, res) => {

}
//update current week
const updateCurrentWeek = async (req, res) => {

}

const weeks = [
    {
        name: 'Week 1',
        id: 0,
        isCurrent: true
    },
    {
        name: 'Week 2',
        id: 1
    },
    {
        name: 'Week 3',
        id: 2
    },
    {
        name: 'Week 4',
        id: 3
    },
    {
        name: 'Week 5',
        id: 4
    },
    {
        name: 'Week 6',
        id: 5
    },
    {
        name: 'Week 7',
        id: 6
    },
    {
        name: 'Week 8',
        id: 7
    },
    {
        name: 'Week 9',
        id: 8
    },
    {
        name: 'Week 10',
        id: 9
    },
    {
        name: 'Week 11',
        id: 10,
    },
    {
        name: 'Week 12',
        id: 11
    },
    {
        name: 'Week 13',
        id: 12
    },
    {
        name: 'Week 14',
        id: 13
    },
    {
        name: 'Week 15',
        id: 14
    },
    {
        name: 'Week 16',
        id: 15
    },
    {
        name: 'Week 17',
        id: 16
    },
    {
        name: 'Week 18',
        id: 17
    }
]

module.exports = {
    getLastTenSeason,
    getCurrentSeason,
    createNewSeason,
    updateCurrentYear,
    updateCurrentWeek
}