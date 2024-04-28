import axios from 'axios';
import { baseUrl } from '../utils/constants';

const dataOnly = (response => response.data);
const createApiInstance = () => {
    let instance = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    instance.interceptors.request.use(config => {
        const authItem = JSON.parse(localStorage.getItem('auth'))?.accessToken;
        config.headers['authorization'] = `Bearer ${authItem}`;
        return config;
    })
    instance.interceptors.response.use(dataOnly, (error) => {
        let reason;
        if (error.response.status === 400) {
            reason = error?.response?.statusText ?? 'Bad Request';
        }
        if (error.response.status === 401) {
            localStorage.removeItem('auth');
            reason = 'Unauthorized';
            //Navigate to unauthorized page
        }

        if (error.response.status === 403) {
            // window.location.href = '/login';
        }

        return Promise.reject(reason);
    });

    return instance;
}
export default createApiInstance();