import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens } from '../types/auth';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  initialized: boolean;
  setTokens: (tokens: AuthTokens) => void;
  clearTokens: () => void;
  setUser: (user: User | null) => void;
  setLoading: (v: boolean) => void;
  markInitialized: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      initialized: false,
      setTokens: ({ accessToken, refreshToken }: AuthTokens) => {
        set({ accessToken, refreshToken });
      },
      clearTokens: () => {
        set({ accessToken: null, refreshToken: null, user: null });
      },
      setUser: (user: User | null) => set({ user }),
      setLoading: (v: boolean) => set({ loading: v }),
      markInitialized: () => set({ initialized: true }),
    }),
    {
      name: 'pulsegate-auth',
      getStorage: () => localStorage,
      // Only persist tokens and maybe user
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);

// Lightweight helpers to access state outside React components
export const authStore = {
  getState: () => (useAuthStore as any).getState(),
  setState: (patch: Partial<AuthState>) => (useAuthStore as any).setState(patch),
};
