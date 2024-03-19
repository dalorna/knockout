import axios from 'axios'
import { baseUrl } from '../utils/constants';

export const getUser = (userId) => axios.get(`${baseUrl}/user?id=${userId}`);

export const getLeagues = (userId) => axios.get(`${baseUrl}/league?userId=${userId}`);
export const saveLeague = (league) => axios.post(`${baseUrl}/league`, league)