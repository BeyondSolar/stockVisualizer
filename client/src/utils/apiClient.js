import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

// Create axios instance
const createAPIClient = (basePath, token = null) => {
  const instance = axios.create({
    baseURL: `${baseURL}/${basePath}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor
  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message =
        error.response?.data?.message || error.message || 'Something went wrong';
      console.error(`API Error [${basePath}]:`, message);
      return Promise.reject(new Error(message));
    }
  );

  return instance;
};

export default createAPIClient;
