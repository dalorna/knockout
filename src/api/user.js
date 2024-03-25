import axios from 'axios'
import { baseUrl } from '../utils/constants';

export const getUser = (userId) => axios.get(`${baseUrl}/user?id=${userId}`);

export const savePick = (pick) => axios.post(`${baseUrl}/pick`, pick);

export const getPick = (userId, leagueId, seasonId, gameId) => axios.get(`${baseUrl}/pick?userId=${userId}&leagueId=${leagueId}&seasonId=${seasonId}&gameId=${gameId}`);