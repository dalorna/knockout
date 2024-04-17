import axios from 'axios';
import { baseUrl } from '../utils/constants';

const dataOnly = (response => response.data);
const createApiInstance = () => {
    const token = JSON.parse(localStorage.getItem('auth'))?.accessToken;
    let instance = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    });
    instance.interceptors.response.use(dataOnly, (error) => {
        console.error(error);
    });

    return instance;
}
export default createApiInstance();