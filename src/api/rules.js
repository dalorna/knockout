import axios from 'axios'
import { baseUrl } from '../utils/constants';

export const getRule = (rule) => axios.get(`${baseUrl}/rule/${rule.id}`);
export const getRuleByLeagueId = (leagueId) => axios.get(`${baseUrl}/rule?leagueId=${leagueId}`);
export const saveRule = (rule) => axios.post(`${baseUrl}/rule`, rule);
export const updateRule = (rule) => axios.put(`${baseUrl}/rule/${rule.id}`, rule);
export const deleteRule = (rule) => axios.delete(`${baseUrl}/rule/${rule.id}`);
export const saveRules = async (rules) => {
    for(const rule of rules) {
        await saveRule(rule)
    }
}
export const updateRules = async (rules) => {
    for(const rule of rules) {
        await updateRule(rule)
    }
} 
export const deleteRules = async (rules) => {
    for(const rule of rules) {
        await deleteRule(rule)
    }
}