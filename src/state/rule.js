import { useParams } from 'react-router';
import {atomFamily, useRecoilValue} from 'recoil';
import {getRuleByLeagueId} from '../api/rules';
import {getLeagues, getUser} from '../api/user';


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
    const { userId } = useParams();
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
    const { userId } = useParams();
    return useRecoilValue(leagueFamily(userId))
}