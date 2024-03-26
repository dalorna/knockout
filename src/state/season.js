import {atomFamily, useRecoilValue} from 'recoil';
import {getSeasonWeeklySchedule} from '../api/nfl';
import {getUserPicks} from '../api/rules';
import {getLeagueSeason} from '../api/league';

const nflSeasonFamily = atomFamily({
    key: 'nfl/season',
    default: async (year) => {
        try{
            return year && await getSeasonWeeklySchedule(year);
        } catch {
            return null;
        }
    }
}) 

export const useNFLSeason = (year) => {
    return  useRecoilValue(nflSeasonFamily(year))
}

export const useWeeklySchedule = (year, week) => {
    const nflSchedule = useNFLSeason(year);
    const weekly = Object.groupBy(nflSchedule.data.body, ({gameWeek}) => gameWeek);
    const weeklySchedule = Object.keys(weekly).map((key) => weekly[key]);
    return weeklySchedule[week - 1];
}

const pickAtomFamily = atomFamily({
    key: 'pick',
    default: async ({userId, leagueSeasonId, weekId}) => {
        try {
            return await getUserPicks(userId, leagueSeasonId, weekId);
        } catch {
            return null;
        }
    }
})

export const useCurrentPickLeagueSeasonWeek = (userId, leagueSeasonId, weekId) => {
    return useRecoilValue(pickAtomFamily({userId, leagueSeasonId, weekId}));
}

const leagueSeasonFamily = atomFamily({
    key: 'leagueSeason',
    default: async ({leagueId, seasonId}) => {
        try {
            return leagueId && seasonId && await getLeagueSeason(leagueId, seasonId);
        } catch {
            return null;
        }
    }
})

export const useCurrentLeagueSeason = (leagueId, seasonId) => {
    return useRecoilValue(leagueSeasonFamily({leagueId: leagueId, seasonId: seasonId}));
}