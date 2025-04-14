import { create } from 'zustand';
import { fetchApi } from '../lib/utils';

export interface KnowledgeBase {
  id: string;
  title: string;
  created_at: string;
}

interface KnowledgeBaseState {
  entries: KnowledgeBase[];
  isLoading: boolean;
  fetchEntries: () => Promise<void>;
  addEntry: (resumeData: string, additionalData?: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

export const useKnowledgeBaseStore = create<KnowledgeBaseState>((set, get) => ({
  entries: [],
  isLoading: false,
  fetchEntries: async () => {
    set({ isLoading: true });
    try {
      const entries = await fetchApi('/api/kb/list');
      set({ entries, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  addEntry: async (resumeData: string, additionalData?: string) => {
    set({ isLoading: true });
    try {
      await fetchApi('/api/kb/', {
        method: 'POST',
        body: JSON.stringify({ resume_data: resumeData, additional_text_data: additionalData }),
      });
      await get().fetchEntries();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  deleteEntry: async (id: string) => {
    set({ isLoading: true });
    try {
      await fetchApi(`/api/kb/${id}`, { method: 'DELETE' });
      await get().fetchEntries();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));