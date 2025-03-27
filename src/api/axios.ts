import axios from 'axios';
import { config } from '../config/config';

axios.defaults.withCredentials = true;

export const apiClient = axios.create({
    baseURL: config.apiBaseURL + '/api/v2/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        return config;
    },
    (error) => Promise.reject(error),
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    },
);
