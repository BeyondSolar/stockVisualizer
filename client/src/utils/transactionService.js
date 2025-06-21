import createAPIClient from './apiClient';

const txAPI = (token) => createAPIClient('transact', token);

export const buyStock = (data, token) => {
  return txAPI(token).post('/buy', data);
};

export const sellStock = (data, token) => {
  return txAPI(token).post('/sell', data);
};

export const getPortfolioSummary = (token) => {
  return txAPI(token).get('/summary');
};
