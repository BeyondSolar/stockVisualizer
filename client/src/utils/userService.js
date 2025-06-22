import createAPIClient from './apiClient';

export const getWallet = (token) => {
  const api = createAPIClient('user', token);
  return api.get('/me');
};


export const resetWallet = (token) => {
  const api = createAPIClient('user', token);
  return api.post('/reset-wallet');
};


