import { useParams } from 'react-router';
import { atomFamily, useRecoilValue } from 'recoil';
import { getRuleByLeagueId } from '../api/rules';
import { getUser } from '../api/user';
import { getLeagues } from '../api/league';
import { getCurrentSeason } from '../api/league';
import {useUser} from './user';


export const useRuleParams = () => {
    const { ruleId, leagueId } = useParams();
    return {ruleId:  ruleId?.toLowerCase(), leagueId: leagueId.toLowerCase()};
};

const ruleFamily = atomFamily({
   key: 'rules',
   default: async (params) => {
       try {
           return params.ruleId && params.leagueId && await getRuleByLeagueId(params.ruleId, params.leagueId)
           } catch {
           return  null;
       }
   }
});

export const useCurrentRules = () => {
    const rules = useRuleParams();
    return useRecoilValue(ruleFamily(rules))
}

const userFamily = atomFamily({
    key: 'user',
    default: async (userId) => {
        try {
            return userId && await getUser(userId)
        } catch {
            return null;
        }
    }
});

export const useCurrentUser = () => {
    const userId = useUser();
    return useRecoilValue(userFamily(userId));
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
    const userId = useUser()
    return useRecoilValue(leagueFamily(userId))
}

export const useCL = (userId) => {
    return useRecoilValue(leagueFamily(userId))
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
    return useRecoilValue(seasonFamily((new Date()).getFullYear()))
}