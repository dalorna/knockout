import axios from './axios';

export const getUserPicks = (userId, leagueSeasonId, weekId) => axios.post(`/pick/${weekId}`, {userId, leagueSeasonId});
export const savePick = (pick) => axios.post(`/pick`, pick);
export const updatePick = (pick) => axios.put(`/pick`, pick);
export const getPicksByWeek = (leagueSeasonId, weekId) => axios.get(`/pick/${leagueSeasonId}/${weekId}`);
export const getPicksByUser = (userId, leagueSeasonId) => axios.get(`/pick/${leagueSeasonId}/user/${userId}`);