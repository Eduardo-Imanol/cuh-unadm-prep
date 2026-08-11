import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AIProvider } from '@/services/aiService';

export interface AIStore {
  apiKey: string;
  provider: AIProvider;
  setApiKey: (key: string) => void;
  setProvider: (provider: AIProvider) => void;
  clearApiKey: () => void;
  hasApiKey: () => boolean;
}

export const useAIStore = create<AIStore>()(
  persist(
    (set, get) => ({
      apiKey: '',
      provider: 'openrouter',
      setApiKey: (key: string) => set({ apiKey: key.trim() }),
      setProvider: (provider: AIProvider) => set({ provider }),
      clearApiKey: () => set({ apiKey: '' }),
      hasApiKey: () => get().apiKey.trim().length > 0,
    }),
    {
      name: 'cuh-ai-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ apiKey: state.apiKey, provider: state.provider }),
    },
  ),
);
