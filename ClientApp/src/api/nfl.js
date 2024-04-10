import axios from 'axios';
import { nflApiHost, nflApiKey } from '../utils/constants';

export const getScore = async () => {
    const options = {
        method: 'GET',
        url: 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLBoxScore',
        params: {
            gameID: '20240121_KC@BUF',
            playByPlay: 'true',
            fantasyPoints: 'true',
            twoPointConversions: '2',
            passYards: '.04',
            passAttempts: '0',
            passTD: '4',
            passCompletions: '0',
            passInterceptions: '-2',
            pointsPerReception: '.5',
            carries: '.2',
            rushYards: '.1',
            rushTD: '6',
            fumbles: '-2',
            receivingYards: '.1',
            receivingTD: '6',
            targets: '0',
            defTD: '6',
            fgMade: '3',
            fgMissed: '-3',
            xpMade: '1',
            xpMissed: '-1'
        },
        headers: {
            'X-RapidAPI-Key': '44f8c96637mshbb70e34a02bf508p17025djsn1890db6d647d',
            'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
        }
    };

    try {
       return await axios.request(options);
    } catch (error) {
        console.error(error);
    }
}
export const getDailySchedule = async () => {
    const options = {
        method: 'GET',
        URL: `https://${nflApiHost}/getNFLGamesForDate`,
        headers: {
            'X-RapidAPI-Key': nflApiKey,
            'X-RapidAPI-Host': nflApiHost
        }
    };
}
export const getSeasonWeeklySchedule = async (season) => {    
    const options = {
        method: 'GET',
        url: `https://${nflApiHost}/getNFLGamesForWeek`,
        params: {
            week: 'all',
            seasonType: 'reg',
            season
        },
        headers: {
            'X-RapidAPI-Key': nflApiKey,
            'X-RapidAPI-Host': nflApiHost
        }
    };
    return await axios.request(options);
}
export const getNFLTeams = async () => {
    const options = {
        method: 'GET',
        url: `https://${nflApiHost}/getNFLTeams`,
        params: {
            rosters: false,
            schedules: false,
            topPerformers: false,
            teamStats: false
        },
        headers: {
            'X-RapidAPI-Key': nflApiKey,
            'X-RapidAPI-Host': nflApiHost
        }
    };
    return await axios.request(options);
}