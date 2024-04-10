import axios from './axios';

export const getLeagues = (userId) => axios.get(`/league/${userId}`);
export const saveLeague = (league) => axios.post(`/league`, league);
export const getLeagueSeasonByLeagueIdSeasonId = (seasonId, leagueId) =>
    axios.get(`/leagueSeason/${seasonId}/${leagueId}`)
export const getCurrentSeason = (year) => axios.get(`$/season?year=${year}`);
export const getLeagueSeason = (id) => axios.get(`/leagueSeason/${id}`);
export const saveLeagueSeason = (leagueSeason) => axios.post(`/leagueSeason`, leagueSeason);
export const updateLeagueSeason = (leagueSeason) => axios.put(`/leagueSeason`, leagueSeason)