import axios from 'axios';
import { baseUrl } from '../utils/constants';
export default axios.create({
    baseURL: baseUrl
})