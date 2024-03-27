import {atomFamily, useRecoilValue, useRecoilRefresher_UNSTABLE, useRecoilCallback, useResetRecoilState} from 'recoil';
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
            console.log('pickAtomFamily')
            return await getUserPicks(userId, leagueSeasonId, weekId);
        } catch {
            return null;
        }
    }
})

export const useCurrentPickLeagueSeasonWeek = (userId, leagueSeasonId, weekId) => {
    return useRecoilValue(pickAtomFamily({userId, leagueSeasonId, weekId}));
}


export const usePickRefresh = () => useRecoilCallback(({refresh, reset , snapshot}) => async ({userId, leagueSeasonId, weekId}) => {
  refresh(pickAtomFamily({userId, leagueSeasonId, weekId}));
  reset(pickAtomFamily({userId, leagueSeasonId, weekId}));
  const r1 = await snapshot.getPromise(pickAtomFamily({userId, leagueSeasonId, weekId}));
  console.log('r1', r1);
})

export const useCurrentPickRefresh = (userId, leagueSeasonId, weekId) => {
/*    console.log('refresh userId: ', userId);
    console.log('refresh leagueSeasonId: ', leagueSeasonId);
    console.log('refresh weekId: ', weekId);*/
    return useRecoilRefresher_UNSTABLE(pickAtomFamily({userId, leagueSeasonId, weekId}))
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