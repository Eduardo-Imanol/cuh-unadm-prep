import { useCallback, useEffect, useState } from 'react';
import { getAllExamAttempts, getAllTopicMastery, setTopicMastered } from '@/db';
import {
  EXAM_AREAS,
  EXAM_META,
  getExamAreaByLabel,
  getExamQuestions,
  type ExamAreaId,
  type ExamMeta,
} from '@/data/exams';
import {
  getSyllabusCountByArea,
  getSyllabusLeavesByArea,
  getSyllabusTotalCount,
} from '@/data/syllabus';
import { useAIStore } from '@/store/aiStore';
import { useAuthStore } from '@/store/authStore';

export type SubjectIconName =
  | 'BookOpen'
  | 'Calculator'
  | 'Laptop'
  | 'Globe'
  | 'Landmark'
  | 'FlaskConical';

export interface SubjectMetric {
  id: ExamAreaId;
  name: string;
  iconName: SubjectIconName;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  color: string;
  badgeText: string;
  examScore?: number;
  examAttempts?: number;
}

export interface SimulatorMetric {
  totalAttempts: number;
  attemptedExams: number;
  totalExams: number;
  averageBestScore: number | undefined;
  pendingExams: ExamMeta[];
}

export interface DashboardMetricsData {
  userName: string;
  hasAIKey: boolean;
  globalProgress: number;
  completedModules: number;
  totalModules: number;
  subjects: SubjectMetric[];
  simulator: SimulatorMetric;
  isLoading: boolean;
  refresh: () => Promise<void>;
  seedDemoData: () => Promise<void>;
}

const AREA_ICON: Partial<Record<ExamAreaId, SubjectIconName>> = {
  espanol: 'BookOpen',
  matematicas: 'Calculator',
  informatica: 'Laptop',
  online: 'Globe',
  sociales: 'Landmark',
  experimentales: 'FlaskConical',
};

const SYLLABUS_COUNTS = getSyllabusCountByArea();

const DEFAULT_SUBJECTS: SubjectMetric[] = EXAM_AREAS.filter(
  (area) => area.id !== 'especifica',
).map((area) => {
  const totalLessons = SYLLABUS_COUNTS[area.id];
  return {
    id: area.id,
    name: area.label,
    iconName: AREA_ICON[area.id] ?? 'BookOpen',
    completedLessons: 0,
    totalLessons,
    percentage: 0,
    color: area.gradient,
    badgeText:
      totalLessons > 0
        ? 'Temas de la ruta de aprendizaje'
        : 'Área evaluada en simulacros',
  };
});

const TOTAL_SYLLABUS_ITEMS = getSyllabusTotalCount();

function getAvailableExams(): ExamMeta[] {
  return EXAM_META.filter((exam) => getExamQuestions(exam.id).length > 0);
}

export function useDashboardData(): DashboardMetricsData {
  const user = useAuthStore((state) => state.user);
  const apiKey = useAIStore((state) => state.apiKey);
  const [isLoading, setIsLoading] = useState(true);

  const [completedModules, setCompletedModules] = useState(0);
  const totalModules = TOTAL_SYLLABUS_ITEMS + EXAM_META.length;
  const [subjects, setSubjects] = useState<SubjectMetric[]>(DEFAULT_SUBJECTS);
  const [simulator, setSimulator] = useState<SimulatorMetric>({
    totalAttempts: 0,
    attemptedExams: 0,
    totalExams: EXAM_META.length,
    averageBestScore: undefined,
    pendingExams: getAvailableExams(),
  });

  const formatUserName = useCallback((): string => {
    if (user?.displayName && user.displayName.trim().length > 0) {
      return user.displayName.split(' ')[0] ?? user.displayName;
    }
    if (user?.email && user.email.trim().length > 0) {
      const namePart = user.email.split('@')[0];
      if (namePart) {
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }
    }
    return 'Aspirante';
  }, [user]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [masteryRecords, attempts] = await Promise.all([
        getAllTopicMastery(),
        getAllExamAttempts(),
      ]);

      const masteredIds = new Set(
        masteryRecords.filter((record) => record.mastered).map((record) => record.id),
      );
      const masteredSyllabusCount = masteredIds.size;

      let updatedSubjects = DEFAULT_SUBJECTS.map((sub) => {
        const leaves = getSyllabusLeavesByArea(sub.id);
        if (leaves.length === 0) {
          return sub;
        }
        const completed = leaves.filter((leaf) => masteredIds.has(leaf.id)).length;
        const pct = Math.round((completed / leaves.length) * 100);
        return {
          ...sub,
          completedLessons: completed,
          percentage: pct,
        };
      });

      const areaAgg: Record<string, { correct: number; total: number; attempts: number }> = {};
      const bestByExam = new Map<string, number>();

      for (const attempt of attempts) {
        let attemptTotal = 0;
        for (const item of attempt.breakdown) {
          const area = getExamAreaByLabel(item.category);
          const key = area?.id ?? item.category;
          const agg = areaAgg[key] ?? { correct: 0, total: 0, attempts: 0 };
          agg.correct += item.correct;
          agg.total += item.total;
          agg.attempts += 1;
          areaAgg[key] = agg;
          attemptTotal += item.total;
        }
        const total = attemptTotal > 0 ? attemptTotal : 1;
        const percentage = Math.round((attempt.score / total) * 100);
        bestByExam.set(
          attempt.examId,
          Math.max(bestByExam.get(attempt.examId) ?? 0, percentage),
        );
      }

      if (attempts.length > 0) {
        updatedSubjects = updatedSubjects.map((sub) => {
          const agg = areaAgg[sub.id];
          if (!agg || agg.total === 0) {
            return sub;
          }
          const examScore = Math.round((agg.correct / agg.total) * 100);
          return {
            ...sub,
            percentage:
              sub.totalLessons > 0 ? Math.max(sub.percentage, examScore) : examScore,
            examScore,
            examAttempts: agg.attempts,
          };
        });

        setSimulator({
          totalAttempts: attempts.length,
          attemptedExams: bestByExam.size,
          totalExams: EXAM_META.length,
          averageBestScore:
            bestByExam.size > 0
              ? Math.round([...bestByExam.values()].reduce((acc, curr) => acc + curr, 0) / bestByExam.size)
              : undefined,
          pendingExams: getAvailableExams().filter((exam) => !bestByExam.has(exam.id)),
        });
      }

      setSubjects(updatedSubjects);
      setCompletedModules(masteredSyllabusCount + bestByExam.size);
    } catch {
      // Fallback silently to defaults
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const seedDemoData = useCallback(async () => {
    setIsLoading(true);
    try {
      const plan: Array<[ExamAreaId, number]> = [
        ['espanol', 14],
        ['matematicas', 11],
        ['informatica', 9],
      ];

      for (const [area, count] of plan) {
        const leaves = getSyllabusLeavesByArea(area).slice(0, count);
        for (const leaf of leaves) {
          await setTopicMastered(leaf.id, leaf.area, true);
        }
      }

      await loadData();
    } catch {
      // ignore seed errors
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  const globalProgress = Math.round((completedModules / totalModules) * 100);

  return {
    userName: formatUserName(),
    hasAIKey: apiKey.trim().length > 0,
    globalProgress,
    completedModules,
    totalModules,
    subjects,
    simulator,
    isLoading,
    refresh: loadData,
    seedDemoData,
  };
}
