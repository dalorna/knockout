import axios from './axios'

export const getUser = (userId) => axios.get(`/auth/user?id=${userId}`);