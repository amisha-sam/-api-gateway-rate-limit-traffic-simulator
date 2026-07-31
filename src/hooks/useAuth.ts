import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const clearTokens = useAuthStore((s) => s.clearTokens);
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password);
    setTokens(res.tokens);
    const user = await authService.getCurrentUser();
    setUser(user);
    return user;
  }, [setTokens, setUser]);

  const signup = useCallback(async (payload: any) => {
    await authService.register(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      // ignore
    }
    clearTokens();
    setUser(null);
    navigate('/login');
  }, [clearTokens, setUser, navigate]);

  const refreshToken = useCallback(async () => {
    const { refreshToken } = (useAuthStore as any).getState();
    if (!refreshToken) throw new Error('No refresh token');
    const res = await authService.refresh(refreshToken);
    setTokens(res.tokens);
    return res.tokens;
  }, [setTokens]);

  return { login, signup, logout, refreshToken };
}
