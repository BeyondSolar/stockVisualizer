import axios from 'axios';

//authorization api
const AUTH_API = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
});

export const login = (email, password) =>
  AUTH_API.post('/login', { email, password });

export const register = (username, email, password) =>
  AUTH_API.post('/register', { username, email, password });



//stock fetch api
const API = axios.create({
  baseURL: 'http://localhost:5000/api/stock', // backend URL
});

export const getQuote = (symbol) => API.get(`/quote/${symbol}`);
export const getHistory = (symbol) => API.get(`/history/${symbol}`);




//stock update api
const STOCK_API = axios.create({
    baseURL: 'http://localhost:5000/api/stock'
})

export const saveStock = (symbol, token) =>
  STOCK_API.post('/save', { symbol }, {
    headers: { Authorization: `Bearer ${token}` } ,
  });

export const getSavedStocks = (token) =>
  STOCK_API.get('/my', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteStock = (stockId, token) =>
  STOCK_API.delete(`/${stockId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

