import { useCallback, useEffect, useRef, useState } from 'react';
import { getAllTopicMastery, setTopicMastered } from '@/db';

export interface TopicMasteryState {
  masteredIds: Set<string>;
  isLoading: boolean;
  toggle: (id: string, area: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useTopicMastery(): TopicMasteryState {
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const masteredRef = useRef<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const records = await getAllTopicMastery();
      const next = new Set(records.filter((record) => record.mastered).map((record) => record.id));
      masteredRef.current = next;
      setMasteredIds(next);
    } catch {
      masteredRef.current = new Set();
      setMasteredIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = useCallback(async (id: string, area: string) => {
    const currentlyMastered = masteredRef.current.has(id);
    const nextMastered = !currentlyMastered;

    masteredRef.current = new Set(masteredRef.current);
    if (nextMastered) {
      masteredRef.current.add(id);
    } else {
      masteredRef.current.delete(id);
    }
    setMasteredIds(masteredRef.current);

    try {
      await setTopicMastered(id, area, nextMastered);
    } catch {
      masteredRef.current = new Set(masteredRef.current);
      if (nextMastered) {
        masteredRef.current.delete(id);
      } else {
        masteredRef.current.add(id);
      }
      setMasteredIds(masteredRef.current);
    }
  }, []);

  return { masteredIds, isLoading, toggle, refresh: load };
}
