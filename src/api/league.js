import axios from 'axios'
import { baseUrl } from '../utils/constants';


/*
export const getUser = (userId) => axios.get(`${baseUrl}/user?id=${userId}`);
export const getLeagues = (userId) => axios.get(`${baseUrl}/league?userId=${userId}`);
export const saveLeague = (league) => axios.post(`${baseUrl}/league`, league)*/
export const getLeagues = (userId) => axios.get(`${baseUrl}/league?userId=${userId}`);
export const saveLeague = (league) => axios.post(`${baseUrl}/league`, league)
export const getCurrentSeason = (year) => axios.get(`${baseUrl}/season?year=${year}`);
export const getLeagueSeason = (leagueId, seasonId) => axios.get(`${baseUrl}/leagueSeason?seasonId=${seasonId}&leagueId=${leagueId}`);
export const saveLeagueSeason = (leagueSeason) => axios.post(`${baseUrl}/leagueSeason`, leagueSeason);
export const updateLeagueSeason = (leagueSeasonId, leagueSeason) => axios.put(`${baseUrl}/leagueSeason/${leagueSeasonId}`, leagueSeason)
