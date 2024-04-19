import axios from './axios';

export const createSeason = (year) => axios.post(`/season`, year);
