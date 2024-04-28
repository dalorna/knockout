import {
    atomFamily,
    useRecoilValue,
    useRecoilRefresher_UNSTABLE,
    selectorFamily
} from 'recoil';
import {getPicksByUser, getUserPicks} from '../api/picks';

const pickUserAtomFamily = atomFamily({
    key: 'pick/user',
    default: selectorFamily({
        key: 'pick/user/default',
        get: ({userId, leagueSeasonId}) => async () => {
            try {
                return await getPicksByUser(userId, leagueSeasonId);
            } catch {
                return [];
            }
        }
    })
})

export const useCurrentPickRefresh = (userId, leagueSeasonId) => {
    return useRecoilRefresher_UNSTABLE(pickUserAtomFamily({userId, leagueSeasonId}))
}
export const useCurrentUserPicksLeagueSeason = (userId, leagueSeasonId) => {
    return useRecoilValue(pickUserAtomFamily({userId, leagueSeasonId}));
}
