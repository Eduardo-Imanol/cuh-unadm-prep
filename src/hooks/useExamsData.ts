import { useCallback, useEffect, useState } from 'react';
import { EXAM_META, type ExamMeta } from '@/data/exams';
import { getAllExamAttempts, getAllTopicMastery } from '@/db';
import type { ExamAttempt } from '@/types';
import { computeExamMastery } from '@/utils/examMastery';

export interface ExamStats {
  attempts: number;
  bestScore: number;
  bestScoreDate: number | undefined;
  lastAttemptDate: number | undefined;
}

export interface ExamSelectionItem {
  meta: ExamMeta;
  stats: ExamStats;
  mastery: number | undefined;
}

export interface ExamsData {
  items: ExamSelectionItem[];
  totalExams: number;
  totalAttempts: number;
  attemptedExams: number;
  averageBestScore: number | undefined;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

function computePercentage(attempt: ExamAttempt, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.round((attempt.score / total) * 100);
}

export function useExamsData(): ExamsData {
  const [isLoading, setIsLoading] = useState(true);
  const [attemptsByExam, setAttemptsByExam] = useState<Record<string, ExamAttempt[]>>({});
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allAttempts, masteryRecords] = await Promise.all([
        getAllExamAttempts(),
        getAllTopicMastery(),
      ]);
      setTotalAttempts(allAttempts.length);
      setMasteredIds(
        new Set(masteryRecords.filter((record) => record.mastered).map((record) => record.id)),
      );

      const grouped: Record<string, ExamAttempt[]> = {};
      for (const attempt of allAttempts) {
        const current = grouped[attempt.examId] ?? [];
        current.push(attempt);
        grouped[attempt.examId] = current;
      }
      setAttemptsByExam(grouped);
    } catch {
      setAttemptsByExam({});
      setTotalAttempts(0);
      setMasteredIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const items: ExamSelectionItem[] = EXAM_META.map((meta) => {
    const attempts = attemptsByExam[meta.id] ?? [];

    let best: ExamAttempt | undefined;
    for (const attempt of attempts) {
      if (best === undefined || attempt.score > best.score) {
        best = attempt;
      }
    }

    const lastAttempt = attempts[attempts.length - 1];

    return {
      meta,
      stats: {
        attempts: attempts.length,
        bestScore: best ? computePercentage(best, meta.questionCount) : 0,
        bestScoreDate: best?.date,
        lastAttemptDate: lastAttempt?.date,
      },
      mastery: computeExamMastery(meta, masteredIds),
    };
  });

  const attemptedExams = items.filter((item) => item.stats.attempts > 0).length;

  const scoredItems = items.filter((item) => item.stats.attempts > 0);
  const averageBestScore =
    scoredItems.length === 0
      ? undefined
      : Math.round(
          scoredItems.reduce((acc, item) => acc + item.stats.bestScore, 0) / scoredItems.length,
        );

  return {
    items,
    totalExams: EXAM_META.length,
    totalAttempts,
    attemptedExams,
    averageBestScore,
    isLoading,
    refresh: loadData,
  };
}
