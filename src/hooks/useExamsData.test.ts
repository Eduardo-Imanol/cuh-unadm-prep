import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { addExamAttempt, db } from '@/db';
import { useExamsData } from '@/hooks/useExamsData';

describe('useExamsData hook', () => {
  beforeEach(async () => {
    await db.examAttempts.clear();
  });

  it('returns the 4 catalog exams with no attempts when DB is empty', async () => {
    const { result } = renderHook(() => useExamsData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.items).toHaveLength(4);
    expect(result.current.totalAttempts).toBe(0);
    expect(result.current.attemptedExams).toBe(0);
    expect(result.current.averageBestScore).toBeUndefined();
    expect(result.current.items[0]?.stats.attempts).toBe(0);
  });

  it('computes per-exam stats from stored attempts', async () => {
    await addExamAttempt({
      examId: 'examen-1',
      answers: {},
      score: 70,
      breakdown: [{ category: 'Español', correct: 70, total: 100 }],
      timeSpentSeconds: 1800,
    });
    await addExamAttempt({
      examId: 'examen-1',
      answers: {},
      score: 90,
      breakdown: [{ category: 'Español', correct: 90, total: 100 }],
      timeSpentSeconds: 2100,
    });
    await addExamAttempt({
      examId: 'examen-2',
      answers: {},
      score: 50,
      breakdown: [{ category: 'Español', correct: 10, total: 20 }],
      timeSpentSeconds: 2400,
    });

    const { result } = renderHook(() => useExamsData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    const diagnosis = result.current.items.find(
      (item) => item.meta.id === 'examen-1',
    );
    expect(diagnosis?.stats.attempts).toBe(2);
    expect(diagnosis?.stats.bestScore).toBe(90);
    expect(diagnosis?.stats.lastAttemptDate).toBeDefined();

    const general = result.current.items.find(
      (item) => item.meta.id === 'examen-2',
    );
    expect(general?.stats.attempts).toBe(1);
    expect(general?.stats.bestScore).toBe(50);

    expect(result.current.totalAttempts).toBe(3);
    expect(result.current.attemptedExams).toBe(2);
    expect(result.current.averageBestScore).toBe(70);
  });
});
