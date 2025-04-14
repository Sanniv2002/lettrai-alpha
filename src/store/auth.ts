import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchApi } from '../lib/utils';

interface AuthState {
  user: { email: string } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetchApi('/auth/login/', {
            method: 'POST',
            body: { email, password },
          });
          set({ user: { email }, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: async () => {
        set({ isLoading: true });
        try {
          await fetchApi('/auth/logout/', { method: 'POST' });
          set({ user: null, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);