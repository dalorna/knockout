import axios from './axios';

export const getUserPicks = (userId, leagueSeasonId, weekId) => axios.post(`/pick/${weekId}`, {userId, leagueSeasonId});
export const savePick = (pick) => axios.post(`/pick`, pick);
export const updatePick = (pick) => axios.put(`/pick`, pick);