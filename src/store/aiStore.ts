import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface AIStore {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  hasApiKey: () => boolean;
}

export const useAIStore = create<AIStore>()(
  persist(
    (set, get) => ({
      apiKey: '',
      setApiKey: (key: string) => set({ apiKey: key.trim() }),
      clearApiKey: () => set({ apiKey: '' }),
      hasApiKey: () => get().apiKey.trim().length > 0,
    }),
    {
      name: 'cuh-ai-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
