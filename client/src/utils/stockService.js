import createAPIClient from './apiClient';

const stockAPI = (token) => createAPIClient('stock', token);

export const getQuote = (symbol) => {
  return stockAPI().get(`/quote/${symbol}`);
};

export const getHistory = (symbol) => {
  return stockAPI().get(`/history/${symbol}`);
};

export const saveStock = (symbol, token) => {
  return stockAPI(token).post('/save', { symbol });
};

export const getSavedStocks = (token) => {
  return stockAPI(token).get('/my');
};

export const deleteStock = (stockId, token) => {
  return stockAPI(token).delete(`/${stockId}`);
};

export const getMarketStocks = (token) => {
  return stockAPI(token).get('/market');
};

export const getStockHolding = (symbol, token) => {
  return stockAPI(token).get(`/holdings/${symbol}`);
};

