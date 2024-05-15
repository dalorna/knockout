import axios from './axios';

export const sendEmail = (email) => axios.post('/mail', email);
export const sendRecoveryEmail = (email) => axios.post('/recovery', email);
export const sendUsernameEmail = (email) => axios.post('/recovery/username', email);