import { create } from 'zustand';
import { fetchApi } from '../lib/utils';

interface AuthState {
  user: { email: string } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetchApi('/auth/login/', {
        method: 'POST',
        body: { email, password },
      });
      // Token is handled by cookies automatically
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
}));