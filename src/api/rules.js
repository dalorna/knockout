import axios from 'axios'
import { baseUrl } from '../utils/constants';

export const getRule = (rule) => axios.get(`${baseUrl}/rule/${rule.id}`);
export const getRuleByLeagueId = (leagueId) => axios.get(`${baseUrl}/rule?leagueId=${leagueId}`);
export const saveRule = (rule) => axios.post(`${baseUrl}/rule`, rule);
export const updateRule = (rule) => axios.put(`${baseUrl}/rule/${rule.id}`, rule);
export const deleteRule = (rule) => axios.delete(`${baseUrl}/rule/${rule.id}`);
export const getUserPicks = (userId, leagueSeasonId, weekId) => axios.get(`${baseUrl}/pick?userId=${userId}&leagueSeasonId=${leagueSeasonId}&weekId=${weekId}`);
export const savePick = (pick) => axios.post(`${baseUrl}/pick`, pick);
export const updatePick = (pick) => axios.put(`${baseUrl}/pick/${pick.id}`, pick);