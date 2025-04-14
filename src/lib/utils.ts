import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // This enables sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchApi(endpoint: string, options: { method?: string; body?: any; headers?: Record<string, string> } = {}) {
  try {
    const { method = 'GET', body, headers = {} } = options;
    
    const response = await api.request({
      method,
      url: endpoint,
      data: body,
      headers,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        // Redirect to login or handle unauthorized access
        window.location.href = '/login';
      }
      throw new Error(error.response?.data?.message || 'API request failed');
    }
    throw error;
  }
}