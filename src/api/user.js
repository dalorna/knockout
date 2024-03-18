import axios from 'axios'
import { baseUrl } from '../utils/constants';

export const getUser = (userId) => axios.get(`${baseUrl}/user?Id=${userId}`);

export const getLeagues = (userId) => axios.get(`${baseUrl}/league?UserId=${userId}`)