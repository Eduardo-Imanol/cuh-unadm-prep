import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useAuthBootstrap(): void {
  useEffect(() => {
    const unsubscribe = useAuthStore.getState().subscribeToAuth();
    return unsubscribe;
  }, []);
}
