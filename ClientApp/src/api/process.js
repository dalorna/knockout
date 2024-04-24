import axios from './axios';

export const processWeek = (weekWithLeagueSeasonId) => axios.post(`/process`, weekWithLeagueSeasonId);