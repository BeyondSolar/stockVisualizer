import createAPIClient from './apiClient';

export const resetWallet = (token) => {
  const api = createAPIClient('/user', token);
  return api.post('/reset-wallet');
};
