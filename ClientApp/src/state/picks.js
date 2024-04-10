import {
    atomFamily,
    useRecoilValue,
    useRecoilRefresher_UNSTABLE,
    selectorFamily
} from 'recoil';
import {getUserPicks} from '../api/picks';

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
