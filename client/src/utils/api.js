import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;
console.log('🔍 API BASE URL:', baseURL);

// authorization api
const AUTH_API = axios.create({
  baseURL: `${baseURL}/auth`,
});

export const login = (email, password) =>
  AUTH_API.post('/login', { email, password });

export const register = (username, email, password) =>
  AUTH_API.post('/register', { username, email, password });

// stock fetch api
const API = axios.create({
  baseURL: `${baseURL}/stock`,
});

export const getQuote = (symbol) => API.get(`/quote/${symbol}`);
export const getHistory = (symbol) => API.get(`/history/${symbol}`);

// stock update api
const STOCK_API = axios.create({
  baseURL: `${baseURL}/stock`,
});

export const saveStock = (symbol, token) =>
  STOCK_API.post('/save', { symbol }, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getSavedStocks = (token) =>
  STOCK_API.get('/my', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteStock = (stockId, token) =>
  STOCK_API.delete(`/${stockId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
