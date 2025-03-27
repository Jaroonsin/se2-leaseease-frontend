import axios from 'axios';
axios.defaults.withCredentials = true;

export const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL + 'api/v2/';
export const apiClient = axios.create({
    baseURL: "http://" + baseURL,
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
