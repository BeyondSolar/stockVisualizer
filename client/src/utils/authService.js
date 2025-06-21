import createAPIClient from './apiClient';
const authAPI = createAPIClient('auth');

export const login = (email, password) =>
  authAPI.post('/login', { email, password });

export const register = (username, email, password) =>
  authAPI.post('/register', { username, email, password });
