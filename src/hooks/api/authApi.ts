// src/services/api/authApi.ts
import { apiClient } from './client';

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials).then((res) => res.data),

  getMe: () => apiClient.get('/auth/me').then((res) => res.data),

  register: (data: { email: string; password: string; name: string }) =>
    apiClient.post('/auth/register', data).then((res) => res.data),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
};