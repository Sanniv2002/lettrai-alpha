import { create } from 'zustand';
import { fetchApi } from '../lib/utils';

export interface Job {
  _id: string;
  type: 'email' | 'cv';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  flow: string[];
  kb_id: string;
  base_prompt: string;
}

interface JobsState {
  jobs: Job[];
  isLoading: boolean;
  fetchJobs: () => Promise<void>;
  getJobResult: (jobId: string) => Promise<string>;
}

export const useJobsStore = create<JobsState>((set) => ({
  jobs: [],
  isLoading: false,
  fetchJobs: async () => {
    set({ isLoading: true });
    try {
      const { jobs } = await fetchApi('/api/jobs/list');
      set({ jobs, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  getJobResult: async (jobId: string) => {
    const result = await fetchApi(`/api/generation/${jobId}`);
    return result.content;
  },
}));