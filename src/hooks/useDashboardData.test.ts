import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/db';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAIStore } from '@/store/aiStore';
import { useAuthStore } from '@/store/authStore';
import type { User } from 'firebase/auth';

const mockUser = {
  uid: 'test-uid',
  displayName: 'Carlos López',
  email: 'carlos@example.com',
} as User;

describe('useDashboardData hook', () => {
  beforeEach(async () => {
    await db.progress.clear();
    await db.topicMastery.clear();
    await db.examAttempts.clear();
    useAuthStore.setState({ user: mockUser, status: 'authenticated' });
    useAIStore.setState({ apiKey: '' });
  });

  it('provides formatted user name and default metrics when DB is empty', async () => {
    const { result } = renderHook(() => useDashboardData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.userName).toBe('Carlos');
    expect(result.current.subjects.length).toBe(6);
    expect(result.current.hasAIKey).toBe(false);
  });

  it('detects AI key when configured in aiStore', async () => {
    useAIStore.setState({ apiKey: 'sk-or-v1-test-key-123' });

    const { result } = renderHook(() => useDashboardData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.hasAIKey).toBe(true);
  });

  it('seeds demo data and updates progress in Dexie', async () => {
    const { result } = renderHook(() => useDashboardData());

    await act(async () => {
      await result.current.seedDemoData();
    });

    const count = await db.topicMastery.count();
    expect(count).toBeGreaterThan(0);
    expect(result.current.completedModules).toBe(34);
  });
});
