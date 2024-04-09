import axios from './axios';

export const getRule = (rule) => axios.get(`/rule/${rule.id}`);
export const getRuleByLeagueId = (leagueId) => axios.get(`/rule?leagueId=${leagueId}`);
export const saveRule = (rule) => axios.post(`/rule`, rule);
export const updateRule = (rule) => axios.put(`/rule/${rule.id}`, rule);
export const deleteRule = (rule) => axios.delete(`/rule/${rule.id}`);
export const getUserPicks = (userId, leagueSeasonId, weekId) => axios.get(`/pick?userId=${userId}&leagueSeasonId=${leagueSeasonId}&weekId=${weekId}`);
export const savePick = (pick) => axios.post(`/pick`, pick);
export const updatePick = (pick) => axios.put(`/pick/${pick.id}`, pick);