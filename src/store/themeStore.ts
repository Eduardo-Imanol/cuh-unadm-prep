import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

export interface ThemeStore {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      toggle: () =>
        set((state) => {
          const next = state.mode === 'light' ? 'dark' : 'light';
          applyTheme(next);
          return { mode: next };
        }),
      setMode: (mode) => {
        applyTheme(mode);
        set({ mode });
      },
    }),
    { name: 'cuh-theme-storage' },
  ),
);
