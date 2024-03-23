import axios from 'axios';


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
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}