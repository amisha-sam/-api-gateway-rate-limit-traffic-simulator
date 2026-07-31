import api from '../api/axios';
import type { AuthTokens, User } from '../types/auth';

const PATH = '/api/auth';

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post(`${PATH}/login`, { email, password });
    return res.data as { tokens: AuthTokens };
  },

  register: async (payload: any) => {
    const res = await api.post(`${PATH}/register`, payload);
    return res.data;
  },

  logout: async () => {
    const res = await api.post(`${PATH}/logout`);
    return res.data;
  },

  refresh: async (refreshToken: string | null) => {
    // Note: axios client already handles refresh centrally. This method uses the API directly if needed.
    const res = await api.post(`${PATH}/refresh`, { refreshToken });
    return res.data as { tokens: AuthTokens };
  },

  forgotPassword: async (email: string) => {
    const res = await api.post(`${PATH}/forgot-password`, { email });
    return res.data;
  },

  resetPassword: async (token: string, password: string) => {
    const res = await api.post(`${PATH}/reset-password`, { token, password });
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await api.get('/api/users/me');
    return res.data as User;
  },

  updateProfile: async (payload: Partial<User>) => {
    const res = await api.put('/api/users/profile', payload);
    return res.data as User;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.post('/api/auth/change-password', { currentPassword, newPassword });
    return res.data;
  },
};
