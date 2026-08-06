import { useCallback, useEffect, useMemo, useState } from 'react';
import { getExamQuestions, type ExamMeta } from '@/data/exams';
import { addExamAttempt } from '@/db';
import type { ExamQuestion } from '@/types';
import { evaluateExam, type ScoreResult } from '@/utils/scoreCalculator';

export type ExamSessionStatus = 'intro' | 'running' | 'finished';

interface ExamSessionState {
  status: ExamSessionStatus;
  currentIndex: number;
  answers: Record<string, number>;
  startedAt: number;
}

export interface ExamSessionResult {
  result: ScoreResult;
  timeSpentSeconds: number;
}

export interface ExamSession {
  status: ExamSessionStatus;
  questions: ExamQuestion[];
  currentIndex: number;
  currentQuestion: ExamQuestion | undefined;
  answers: Record<string, number>;
  answeredCount: number;
  unansweredCount: number;
  timeLeftSeconds: number;
  result: ExamSessionResult | undefined;
  isSaving: boolean;
  start: () => void;
  answer: (questionId: string, optionIndex: number) => void;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  finish: () => void;
  abandon: () => void;
}

const SESSION_PREFIX = 'cuh-exam-session:';

function storageKey(examId: string): string {
  return `${SESSION_PREFIX}${examId}`;
}

function loadSession(examId: string): ExamSessionState | undefined {
  try {
    const raw = window.sessionStorage.getItem(storageKey(examId));
    if (raw === null) {
      return undefined;
    }
    const parsed = JSON.parse(raw) as Partial<ExamSessionState>;
    if (
      typeof parsed.status !== 'string' ||
      typeof parsed.currentIndex !== 'number' ||
      typeof parsed.answers !== 'object' ||
      parsed.answers === null ||
      typeof parsed.startedAt !== 'number'
    ) {
      return undefined;
    }
    return {
      status: parsed.status as ExamSessionStatus,
      currentIndex: parsed.currentIndex,
      answers: parsed.answers,
      startedAt: parsed.startedAt,
    };
  } catch {
    return undefined;
  }
}

function saveSession(examId: string, state: ExamSessionState): void {
  try {
    window.sessionStorage.setItem(storageKey(examId), JSON.stringify(state));
  } catch {
    // storage unavailable or full: session keeps working in memory
  }
}

function clearSession(examId: string): void {
  try {
    window.sessionStorage.removeItem(storageKey(examId));
  } catch {
    // ignore
  }
}

export function useExamSession(exam: ExamMeta): ExamSession {
  const questions = useMemo(() => getExamQuestions(exam.id), [exam.id]);
  const durationSeconds = exam.durationMinutes * 60;

  const [state, setState] = useState<ExamSessionState>(() => {
    const restored = loadSession(exam.id);
    if (restored) {
      return restored;
    }
    return { status: 'intro', currentIndex: 0, answers: {}, startedAt: 0 };
  });
  const [now, setNow] = useState(() => Date.now());
  const [result, setResult] = useState<ExamSessionResult | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (state.status === 'running') {
      saveSession(exam.id, state);
    } else {
      clearSession(exam.id);
    }
  }, [exam.id, state]);

  useEffect(() => {
    if (state.status !== 'running') {
      return;
    }
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [state.status]);

  const timeLeftSeconds = useMemo(() => {
    if (state.status !== 'running') {
      return durationSeconds;
    }
    const elapsed = Math.floor((now - state.startedAt) / 1000);
    return Math.max(0, durationSeconds - elapsed);
  }, [state.status, state.startedAt, durationSeconds, now]);

  const start = useCallback(() => {
    setResult(undefined);
    setState({ status: 'running', currentIndex: 0, answers: {}, startedAt: Date.now() });
    setNow(Date.now());
  }, []);

  const answer = useCallback((questionId: string, optionIndex: number) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: optionIndex },
    }));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const lastIndex = Math.max(0, questions.length - 1);
      setState((prev) => ({
        ...prev,
        currentIndex: Math.min(Math.max(0, index), lastIndex),
      }));
    },
    [questions.length],
  );

  const next = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, Math.max(0, questions.length - 1)),
    }));
  }, [questions.length]);

  const previous = useCallback(() => {
    setState((prev) => ({ ...prev, currentIndex: Math.max(prev.currentIndex - 1, 0) }));
  }, []);

  const finish = useCallback(async () => {
    if (state.status === 'finished') {
      return;
    }
    const elapsed =
      state.startedAt > 0 ? Math.floor((Date.now() - state.startedAt) / 1000) : 0;
    const score = evaluateExam(questions, state.answers);
    setResult({ result: score, timeSpentSeconds: elapsed });
    setState((prev) => ({ ...prev, status: 'finished' }));
    setIsSaving(true);
    try {
      await addExamAttempt({
        examId: exam.id,
        answers: state.answers,
        score: score.score,
        breakdown: score.breakdown,
        timeSpentSeconds: elapsed,
      });
    } catch {
      // scoring is kept in memory even if persistence fails
    } finally {
      setIsSaving(false);
      clearSession(exam.id);
    }
  }, [exam.id, questions, state.status, state.answers, state.startedAt]);

  const abandon = useCallback(() => {
    clearSession(exam.id);
    setResult(undefined);
    setState({ status: 'intro', currentIndex: 0, answers: {}, startedAt: 0 });
  }, [exam.id]);

  useEffect(() => {
    if (state.status === 'running' && timeLeftSeconds <= 0) {
      void finish();
    }
  }, [state.status, timeLeftSeconds, finish]);

  const answeredCount = questions.filter((question) => state.answers[question.id] !== undefined).length;

  return {
    status: state.status,
    questions,
    currentIndex: state.currentIndex,
    currentQuestion: questions[state.currentIndex],
    answers: state.answers,
    answeredCount,
    unansweredCount: questions.length - answeredCount,
    timeLeftSeconds,
    result,
    isSaving,
    start,
    answer,
    goTo,
    next,
    previous,
    finish,
    abandon,
  };
}
