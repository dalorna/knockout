import axios from './axios';

export const getLeagues = (userId) => axios.get(`/league/${userId}`);
export const saveLeague = (league) => axios.post(`/league`, league);
export const getLeagueSeasonByLeagueIdSeasonId = (seasonId, leagueId) =>
    axios.get(`/leagueSeason/${seasonId}/${leagueId}`)
export const getCurrentSeason = (year) => axios.get(`$/season?year=${year}`);
export const getLeagueSeason = (id) => axios.get(`/leagueSeason/${id}`);
export const saveLeagueSeason = (leagueSeason) => axios.post(`/leagueSeason`, leagueSeason);
export const updateLeagueSeason = (leagueSeason) => axios.put(`/leagueSeason`, leagueSeason);
export const joinLeague = (member) => axios.post('/leagueSeason/join', member);
export const getLeaguesByMember = (member) => axios.post('/leagueSeason/members', member);
export const getLeaguesByLeagueId = (leagueIds) => axios.post('/league/member', leagueIds);
export const getLeagueMemberUsers = (seasonId, leagueId) =>
    axios.get(`/leagueSeason/members/users/${seasonId}/${leagueId}`);
export const getOpenLeagues = (page, userId) => axios.get(`/leagueSeason/join/open/${page}?userId=${userId}`)