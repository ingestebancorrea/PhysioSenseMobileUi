import { apiClient } from '@/services/api/client';

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),

  getMe: () => apiClient.get('/auth/me'),

  register: (data: { email: string; password: string; name: string }) =>
    apiClient.post('/auth/register', data),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
};