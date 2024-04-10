import {atomFamily, useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue} from 'recoil';
import {getLeagues, getLeagueSeasonByLeagueIdSeasonId} from '../api/league';
import { getCurrentSeason } from '../api/league';
import {currentUserAtom} from './user';
import { getNFLTeams } from '../api/nfl';

const seasonLeagueFamily = atomFamily({
    key: 'season/seasonLeague',
    default: async ({seasonId, leagueId}) => {
        try {
            return seasonId && leagueId && await getLeagueSeasonByLeagueIdSeasonId(seasonId, leagueId)
        } catch  {
            return [];
        }
    }
})
export const useSeasonLeague = (leagueId) => {
    const season = useCurrentSeason();
    return useRecoilState(seasonLeagueFamily({seasonId: season.data[0].id, leagueId}))
}
export const useSeasonLeagueRefresher = (leagueId) => {
    const season = useCurrentSeason();
    return useRecoilRefresher_UNSTABLE(seasonLeagueFamily({seasonId: season.data[0].id, leagueId}));
}
const leagueFamily = atomFamily({
    key: 'league',
    default: async (userId) => {
        try {
            return userId && await getLeagues(userId)
        } catch {
            return null;
        }
    }
})
export const useCurrentLeagues = () => {
    const [currentUser,] = useRecoilState(currentUserAtom);
    const userId = currentUser.id;
    const leagues = useRecoilValue(leagueFamily(userId));
    return leagues?.data ?? [];
}
const seasonFamily = atomFamily({
    key: 'leagueSeason',
    default: async (year) => {
        try {
            return year && getCurrentSeason(year)
        } catch {
            return null;
        }
    }
})
export const useCurrentSeason = () => {
    // return useRecoilValue(seasonFamily((new Date()).getFullYear()))
    return {data: [ {
            "id": 2,
            "year": "2024",
            "over": false
        }]}
}
const teamsFamily = atomFamily({
    key: 'nfl/teams',
    default: async () => {
        try {
            return getNFLTeams();
        } catch {
            return null
        }
    }
})
export const useTeams = () => {
    return useRecoilValue(teamsFamily());
}