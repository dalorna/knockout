import axios from './axios';

export const createSeason = (year) => axios.post(`/season`, year);
export const getCurrentSeason = () => axios.get('/season');
export const updateCurrentYear = (year) => axios.put('/season', year);
export const getLastTenSeason = () => axios.get('/season/archive');
export const updateCurrentWeek = (year) => axios.put('/season/week', year)