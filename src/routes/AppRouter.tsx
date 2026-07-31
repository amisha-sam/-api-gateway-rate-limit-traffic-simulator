import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/Login';
import { RegisterPage } from '../pages/auth/Register';
import { ForgotPasswordPage } from '../pages/auth/ForgotPassword';
import { ResetPasswordPage } from '../pages/auth/ResetPassword';
import { ProfilePage } from '../pages/Profile';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const initialized = useAuthStore((s) => s.initialized);

  if (!accessToken && initialized) return <Navigate to="/login" replace />;
  // while initializing, allow render nothing
  if (!initialized) return null;
  return children;
};

export const AppRouter: React.FC = () => {
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const markInitialized = useAuthStore((s) => s.markInitialized);

  useEffect(() => {
    // On app start, if tokens exist in storage, try to refresh and fetch user
    (async () => {
      const { accessToken, refreshToken } = (useAuthStore as any).getState();
      if (!refreshToken) {
        markInitialized();
        return;
      }
      try {
        // Try to fetch user; axios will attempt refresh via interceptor if access expired.
        const user = await authService.getCurrentUser();
        setUser(user);
        markInitialized();
      } catch (err) {
        // attempt refresh by calling refresh endpoint manually is handled by axios interceptors when a request is made
        markInitialized();
      }
    })();
  }, [setUser, markInitialized]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Protected app routes - placeholders that require integrating into main app */}
        <Route path="/dashboard" element={<ProtectedRoute><div className="p-6">Dashboard (protected)</div></ProtectedRoute>} />
        <Route path="/configuration" element={<ProtectedRoute><div className="p-6">Configuration</div></ProtectedRoute>} />
        <Route path="/sandbox" element={<ProtectedRoute><div className="p-6">Sandbox</div></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><div className="p-6">Recommendations</div></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><div className="p-6">Settings</div></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
