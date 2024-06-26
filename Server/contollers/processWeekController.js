const Pick = require('../model/Pick');
const League = require('../model/League');
const Season = require('../model/Season');
const LeagueSeason = require('../model/LeagueSeason');
const User = require('../model/User');
const https = require('https');
const {format} = require('date-fns');

const processWeekByLeagueSeasonId = async (req, res) => {
    if (!req?.body?.week?.name || !req?.body?.leagueSeasonId) {
        return res.status(400).json({"message": `LeagueSeasonId, and week are required`})
    }
    try {
        const leagueSeason = await LeagueSeason.findOne({ _id: req.body.leagueSeasonId }, null, null).exec();
        const league = await League.findOne({ _id: leagueSeason.leagueId }, null, null).exec();
        const resultMembers = leagueSeason.weeklyResults;
        const members = [...leagueSeason.members.map(m => m.userId), league.userId];
        const membersToProcess = [];
        for (const member of members) {
            if (resultMembers.length > 0){
                if (resultMembers.find(f => f.userId === member).alive)
                {
                    membersToProcess.push(member);
                }
            } else {
                membersToProcess.push(member);
            }
        }
        if (leagueSeason) {
            const season = await Season.findOne({_id: leagueSeason.seasonId}, null, null).exec();
            if (season) {
                const weekToProcess = req.body.week.id + 1;
                const picks = await Pick.find({
                    leagueSeasonId: req.body.leagueSeasonId,
                    weekId: weekToProcess
                }, null, null).exec();
                if (picks.length > 0 && members.length > 0) {
                    const leagueResults = await processPicks(membersToProcess, picks, leagueSeason, weekToProcess, req.body.processDateTime);
                    return res.status(201).json(leagueResults);
                }
                return res.status(204).json({"message": `Either there are no picks or all picks are already processed`})
            }
            return res.status(400).json({"message": 'Season not found'})
        } else {
            return res.status(400).json({"message": 'League not found'})
        }
    } catch (err) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.message}`})
    }
}

// Internal use only for testing, resets picks
const setProcessedToFalse = async (req, res) => {
    try {
        const weekToProcess = 1;
        const picks = await Pick.find({
                    leagueSeasonId: req.params.leagueSeasonId,
                    weekId: weekToProcess
                }, null, null).exec();
        if (picks.length === 0) {
            return res.status(204);
        }
        for(const pick of picks) {
            pick.processed = false;
            pick.save();
        }

        return res.status(200).json(picks);

    } catch (err) {
        res.status(500).json({"message": `Server error attempting to get\r ${err.message}`})
    }
}

module.exports = {
    processWeekByLeagueSeasonId,
    setProcessedToFalse
}

const options = {
    method: 'GET',
    hostname: `${process.env.NFL_API_HOST}`,
    headers: {
        'X-RapidAPI-Key': process.env.NFL_API_KEY,
        'X-RapidAPI-Host': process.env.NFL_API_HOST,
        'Content-Type': 'application/json'
    },
    port: 443
};

const nflData = (options) => {
    return new Promise((resolve, reject) => {
       const req = https.request(options, (res) => {
           res.setEncoding('utf8');
           let responseBody = '';

           res.on('data', (chunk) => {
               responseBody += chunk;
           });

           res.on('end', () => {
               resolve(JSON.parse(responseBody));
           });
       });
        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}

const processPicks = async (members, picks, leagueSeason, week, year, date) => {
    const processedPicks = [];
    let weeklyResults;
    const dateTime = date ?? `${format(new Date(), 'yyyyMMdd\tHH:mm')}`;
    let yearToProcess = dateTime.slice(0, 4);
    // console.log('DateTime: ', dateTime.slice(0, 8));
    yearToProcess = '2023'; //temp for testing

    // get the NFL Schedule
    options.path = `/getNFLGamesForWeek?week=${week}&seasonType=reg&season=${yearToProcess}`;
    const weeklySchedule = await nflData(options);

    if (weeklySchedule.statusCode === 200) {
        // need the results for the week from the NFL
        const gameDates = [...new Set(weeklySchedule.body.map(m => m.gameDate))];
        let gamesPlayed = {};
        for(const gameDate of gameDates) {
            options.path = `/getNFLScoresOnly?gameDate=${gameDate}&gameWeek=${week}&season=${yearToProcess}&seasonType=reg&topPerformers=false`;
            const nflPlayed = await nflData(options);
            if (Array.isArray(nflPlayed.body)) {
                for(const game of nflPlayed.body){
                    gamesPlayed = {...game, ...gamesPlayed};
                }
            } else {
                gamesPlayed = {...nflPlayed.body, ...gamesPlayed};
            }
        }

        for (const member of members) {
            const pick = picks.find(f => f.userId === member);
            if (pick) {
                const gamePicked = gamesPlayed[pick.gameId];
                if (gamePicked?.gameStatus === 'Completed' && !pick.processed) {
                    let myPoints = 0;
                    let opPoints = 0;
                    if (gamePicked.teamIDHome === pick.teamId) {
                        myPoints = parseInt(gamePicked['homePts']);
                        opPoints = parseInt(gamePicked['awayPts']);
                    } else {
                        opPoints = parseInt(gamePicked['homePts']);
                        myPoints = parseInt(gamePicked['awayPts']);
                    }
                    if (leagueSeason.rules.gameType === 'survivor') {
                        pick.win = myPoints > opPoints
                        if (opPoints === myPoints) {
                            pick.win = leagueSeason.rules.ties;
                        }
                        pick.scoreDifferential = myPoints - opPoints;
                    } else {
                        pick.win = myPoints < opPoints
                        if (opPoints === myPoints) {
                            pick.win = leagueSeason.rules.ties;
                        }
                        pick.scoreDifferential = opPoints - myPoints;
                    }
                    pick.points = pick.win ? (leagueSeason.rules.earlyPoint ? 19 - week : week) : 0;
                    pick.processed = true;
                    pick.save();
                    processedPicks.push(pick);
                }
            } else {
                const user = await User.findOne({_id: member}, null, null).exec();
                const noPick = await Pick.create({
                    userId: member,
                    username: user.username,
                    weekId: week,
                    leagueSeasonId: leagueSeason._id,
                    teamId: "0",
                    gameId: "No Pick",
                    locked: true,
                    processed: true,
                    points: 0,
                    scoreDifferential: -50
                });
                processedPicks.push(noPick);
            }
        }
        weeklyResults = processLeague(processedPicks, leagueSeason, week);
    }

    return { processedPicks, weeklyResults };

}

const processLeague = (processedPicks, leagueSeason, week) => {
    const currentWeeklyResults = leagueSeason.weeklyResults ?? [];
    for(const pick of processedPicks) {
        const weekResults = {
            win: pick.win,
            teamId: pick.teamId,
            scoreDifferential: pick.scoreDifferential,
            points: pick.points,
            week
        };
        const userResults = currentWeeklyResults.find(f => f.userId === pick.userId) ?? {
            userId: pick.userId,
            username: pick.username,
            alive: true,
            totalScoreDifferential: 0,
            weekResults: []
        };
        userResults.totalScoreDifferential += pick.scoreDifferential;
        userResults.weekResults.push(weekResults);
        if (leagueSeason.rules.elimination === 'hardCore') {
            userResults.alive = !!pick.win;
        } else if (leagueSeason.rules.elimination === 'oneMulligan') {
            userResults.alive = !(userResults.weekResults.map(m => m.win).reduce((t, val) => t + (!val * 1), 0) > 1)
        } else if (leagueSeason.rules.elimination === 'twoMulligan') {
            userResults.alive = !(userResults.weekResults.map(m => m.win).reduce((t, val) => t + (!val * 1), 0) > 2)
        }
        if (!userResults._id) {
            currentWeeklyResults.push(userResults);
        }
    }
    leagueSeason.weeklyResults = currentWeeklyResults;
    leagueSeason.save();
    return leagueSeason;
}