import {
    atomFamily,
    selectorFamily,
    useRecoilCallback,
    useRecoilRefresher_UNSTABLE,
    useRecoilState,
    useRecoilValue
} from 'recoil';
import {
    getLeagueMemberUsers,
    getLeagues,
    getLeaguesByLeagueId,
    getLeaguesByMember,
    getLeagueSeasonByLeagueIdSeasonId
} from '../api/league';
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
    return useRecoilState(seasonLeagueFamily({seasonId: season.id, leagueId}))
}
export const useSeasonLeagueRefresher = (leagueId) => {
    const season = useCurrentSeason();
    return useRecoilRefresher_UNSTABLE(seasonLeagueFamily({seasonId: season.id, leagueId}));
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

const leaguesJoinedFamily = atomFamily({
    key: 'league/joined',
    default: async (leagueIds) => {
        try {
            return leagueIds && await getLeaguesByLeagueId(leagueIds);
        } catch {
            return null;
        }
    }
})

const leagueMemberFamily = atomFamily({
    key: 'league/joined',
    default: selectorFamily({
        key: 'league/joined/default',
        get: (member) => async () => {
            if (member) {
                return await getLeaguesByMember(member);
            }
            return [];
        }
    })
})

export const useRefreshLeague = () =>
    useRecoilCallback(
        ({ refresh, reset }) =>
            (member) => {
            refresh(leagueMemberFamily(member));
            reset(leagueMemberFamily(member))
        },[]
    );


export const useCurrentLeagues = () => {
    const [currentUser,] = useRecoilState(currentUserAtom);
    const userId = currentUser.id;
    const memberLeagues = useRecoilValue(leagueMemberFamily({member: {userId: userId}}));
    const joinedLeagueIds = memberLeagues?.map(m => m.leagueId) || [];
    const joinedLeagues = useRecoilValue(leaguesJoinedFamily({leagueIds: joinedLeagueIds}));
    const myLeagues = useRecoilValue(leagueFamily(userId));
    const leaguesToSelectFrom = [];
    leaguesToSelectFrom.push(...(myLeagues ?? []));
    leaguesToSelectFrom.push(...(joinedLeagues ?? []));
    return leaguesToSelectFrom;
}

export const useCurrentLeagueMembersUsers = (leagueId) => {
    const season = useCurrentSeason();
    return useRecoilValue(leaguesMemberUsersFamily({seasonId: season.id, leagueId})) || [];
}


/*const seasonFamily = atomFamily({
    key: 'leagueSeason',
    default: async (year) => {
        try {
            return year && getCurrentSeason(year)
        } catch {
            return null;
        }
    }
})*/
export const useCurrentSeason = () => {
    // return useRecoilValue(seasonFamily((new Date()).getFullYear()))
    return  {
            "id": 2,
            "year": "2024",
            "over": false
        };
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

const leaguesMemberUsersFamily = atomFamily({
    key: 'league/members/users',
    default: async ({seasonId, leagueId}) => {
        try {
            return seasonId && leagueId && await getLeagueMemberUsers(seasonId, leagueId);
        } catch {
            return [];
        }
    }
})
