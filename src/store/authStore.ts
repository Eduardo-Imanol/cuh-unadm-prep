import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from 'firebase/auth';
import {
  auth,
  configureAuthPersistence,
  isFirebaseConfigured,
} from '@/services/firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type AuthError,
} from 'firebase/auth';
import { mapAuthErrorMessage } from '@/utils/auth';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthStore {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  subscribeToAuth: () => () => void;
  setUser: (user: User | null) => void;
}

const FIREBASE_MISSING_MESSAGE =
  'Firebase no está configurado. Agrega VITE_FIREBASE_* al .env.';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      status: 'idle',
      error: null,

      login: async (email, password) => {
        set({ status: 'loading', error: null });
        if (!auth) {
          set({ status: 'error', error: FIREBASE_MISSING_MESSAGE });
          return;
        }
        try {
          await configureAuthPersistence();
          const credentials = await signInWithEmailAndPassword(auth, email, password);
          set({ user: credentials.user, status: 'authenticated' });
        } catch (error) {
          set({ status: 'error', error: mapAuthErrorMessage((error as AuthError).code) });
        }
      },

      register: async (email, password) => {
        set({ status: 'loading', error: null });
        if (!auth) {
          set({ status: 'error', error: FIREBASE_MISSING_MESSAGE });
          return;
        }
        try {
          await configureAuthPersistence();
          const credentials = await createUserWithEmailAndPassword(auth, email, password);
          set({ user: credentials.user, status: 'authenticated' });
        } catch (error) {
          set({ status: 'error', error: mapAuthErrorMessage((error as AuthError).code) });
        }
      },

      logout: async () => {
        if (!auth) {
          set({ user: null, status: 'unauthenticated' });
          return;
        }
        try {
          await signOut(auth);
        } finally {
          set({ user: null, status: 'unauthenticated' });
        }
      },

      subscribeToAuth: () => {
        if (!auth || !isFirebaseConfigured()) {
          set({ status: 'unauthenticated' });
          return () => undefined;
        }
        set({ status: 'loading' });
        return onAuthStateChanged(auth, (user) => {
          set({ user, status: user ? 'authenticated' : 'unauthenticated' });
        });
      },

      setUser: (user) => set({ user, status: user ? 'authenticated' : 'unauthenticated' }),
    }),
    {
      name: 'cuh-auth-storage',
      partialize: (state) => ({ user: state.user ? { uid: state.user.uid, email: state.user.email } : null }),
    },
  ),
);
