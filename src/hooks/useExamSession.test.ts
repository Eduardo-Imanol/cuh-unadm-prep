import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getExamMeta } from '@/data/exams';
import { db } from '@/db';
import { useExamSession } from '@/hooks/useExamSession';

const exam = getExamMeta('examen-2');
if (exam === undefined) {
  throw new Error('examen-2 must exist in the catalog');
}

describe('useExamSession hook', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(async () => {
    window.sessionStorage.clear();
    await db.examAttempts.clear();
  });

  it('starts in intro state with all 100 questions loaded', () => {
    const { result } = renderHook(() => useExamSession(exam));

    expect(result.current.status).toBe('intro');
    expect(result.current.questions).toHaveLength(100);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.answeredCount).toBe(0);
    expect(result.current.unansweredCount).toBe(100);
    expect(result.current.timeLeftSeconds).toBe(120 * 60);
  });

  it('starts the run and tracks answers and navigation', async () => {
    const { result } = renderHook(() => useExamSession(exam));

    await act(async () => {
      result.current.start();
    });
    expect(result.current.status).toBe('running');
    expect(result.current.currentQuestion?.id).toBe('examen-2-q1');

    await act(async () => {
      result.current.answer('examen-2-q1', 2);
    });
    expect(result.current.answeredCount).toBe(1);
    expect(result.current.answers['examen-2-q1']).toBe(2);

    await act(async () => {
      result.current.next();
    });
    expect(result.current.currentIndex).toBe(1);

    await act(async () => {
      result.current.previous();
    });
    expect(result.current.currentIndex).toBe(0);

    await act(async () => {
      result.current.goTo(99);
    });
    expect(result.current.currentIndex).toBe(99);

    await act(async () => {
      result.current.goTo(999);
    });
    expect(result.current.currentIndex).toBe(99);
  });

  it('finishes, scores the exam and persists the attempt in Dexie', async () => {
    const { result } = renderHook(() => useExamSession(exam));

    await act(async () => {
      result.current.start();
      result.current.answer('examen-2-q1', 2);
    });

    await act(async () => {
      await result.current.finish();
    });

    expect(result.current.status).toBe('finished');
    expect(result.current.result?.result.correct).toBe(1);
    expect(result.current.result?.result.total).toBe(100);
    expect(result.current.result?.result.breakdown.some((item) => item.category === 'Español')).toBe(true);

    const attempts = await db.examAttempts.toArray();
    expect(attempts).toHaveLength(1);
    expect(attempts[0]?.examId).toBe('examen-2');
    expect(attempts[0]?.score).toBe(1);

    expect(window.sessionStorage.getItem('cuh-exam-session:examen-2')).toBeNull();
  });

  it('abandon clears the stored session and returns to intro', async () => {
    const { result } = renderHook(() => useExamSession(exam));

    await act(async () => {
      result.current.start();
    });
    expect(window.sessionStorage.getItem('cuh-exam-session:examen-2')).not.toBeNull();

    await act(async () => {
      result.current.abandon();
    });
    expect(result.current.status).toBe('intro');
    expect(window.sessionStorage.getItem('cuh-exam-session:examen-2')).toBeNull();
  });

  it('restores an in-progress session from sessionStorage on remount', async () => {
    const { result, unmount } = renderHook(() => useExamSession(exam));

    await act(async () => {
      result.current.start();
      result.current.answer('examen-2-q1', 2);
      result.current.goTo(5);
    });
    unmount();

    const restored = renderHook(() => useExamSession(exam));
    expect(restored.result.current.status).toBe('running');
    expect(restored.result.current.answers['examen-2-q1']).toBe(2);
    expect(restored.result.current.currentIndex).toBe(5);
  });
});
