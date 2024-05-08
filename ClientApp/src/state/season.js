import {
    atomFamily,
    selectorFamily,
    useRecoilCallback,
    useRecoilRefresher_UNSTABLE,
    useRecoilState,
    useRecoilValue,
    atom, useSetRecoilState, DefaultValue, useResetRecoilState, selector
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
import { getCurrentSeason } from '../api/season';

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
export const seasonTrigger = atom({
    key: 'forceSeason',
    default: 0
})
/*const seasonFamily = atomFamily({
    key: 'leagueSeason',
    default: selectorFamily({
        key: 'leagueSeason/default',
        get: () => async ({get}) => {
            get(seasonTrigger);
            return await getCurrentSeason();
        },
        set: ({set}, value) => {
            if (value instanceof DefaultValue) {
                set(seasonTrigger, v => v + 1);
            }
        }
    })
})*/

export const seasonSelector = selector({
    key: 'leagueSeasonSelector',
    get: async ({get}) => {
        get(seasonTrigger);
        return await getCurrentSeason();
    },
    set: ({set}, value) => {
        if (value instanceof DefaultValue) {
            set(seasonTrigger, v => v + 1)
        }
    }
});

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

export const useSeasonLeague = (leagueId) => {
    const season = useCurrentSeason();
    return useRecoilState(seasonLeagueFamily({seasonId: season._id, leagueId}))
}
export const useSeasonLeagueRefresher = (leagueId) => {
    const season = useCurrentSeason();
    return useRecoilRefresher_UNSTABLE(seasonLeagueFamily({seasonId: season._id, leagueId}));
}
export const useRefreshLeague = () =>
    useRecoilCallback(
        ({ refresh, reset }) =>
            (member) => {
            refresh(leagueMemberFamily(member));
            reset(leagueMemberFamily(member));
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
export const useCurrentSeason = () => {
    return useRecoilValue(seasonSelector);
}

export const useResetSeason = () => {
    return useResetRecoilState(seasonSelector);
}
export const useTeams = () => {
    return useRecoilValue(teamsFamily({}));
}
export const useCurrentLeagueMembersUsers = (leagueId) => {
    const season = useCurrentSeason();
    return useRecoilValue(leaguesMemberUsersFamily({seasonId: season._id, leagueId})) || [];
}