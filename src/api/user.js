import axios from 'axios'
import { baseUrl } from '../utils/constants';

export const getUser = (userId) => axios.get(`${baseUrl}/user?id=${userId}`);