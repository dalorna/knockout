import axios from './axios';

export const sendEmail = (email) => axios.post('/mail', email);