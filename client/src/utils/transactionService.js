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

export const getTransactionsByDate = (token, startDate, endDate) => {
  const params = new URLSearchParams();

  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return txAPI(token).get(`/getTransactions?${params.toString()}`);
};
