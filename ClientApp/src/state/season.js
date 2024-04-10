import {
    atomFamily,
    useRecoilValue,
    useRecoilRefresher_UNSTABLE,
    selectorFamily
} from 'recoil';
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
    default: selectorFamily({
        key: 'pick/default',
        get: ({userId, leagueSeasonId, weekId}) => async () => {
            try {
                return await getUserPicks(userId, leagueSeasonId, weekId);
            } catch {
                return { data: []};
            }
        }
    })
})

export const useCurrentPickLeagueSeasonWeek = (userId, leagueSeasonId, weekId) => {
    return useRecoilValue(pickAtomFamily({userId, leagueSeasonId, weekId}));
}

export const useCurrentPickRefresh = (userId, leagueSeasonId, weekId) => {
    return useRecoilRefresher_UNSTABLE(pickAtomFamily({userId, leagueSeasonId, weekId}))
}

const leagueSeasonFamily = atomFamily({
    key: 'leagueSeason',
    default: async ({id}) => {
        try {
            return id && await getLeagueSeason(id);
        } catch {
            return null;
        }
    }
})

export const useCurrentLeagueSeason = (id) => {
    return useRecoilValue(leagueSeasonFamily({id}));
}