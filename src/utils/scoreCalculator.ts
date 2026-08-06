import type { ExamBreakdown, ExamQuestion } from '@/types';

export interface ScoreResult {
  score: number;
  total: number;
  percentage: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  breakdown: ExamBreakdown[];
}

export function evaluateExam(
  questions: ExamQuestion[],
  answers: Record<string, number>,
): ScoreResult {
  const breakdownMap = new Map<string, ExamBreakdown>();

  let correct = 0;
  let unanswered = 0;

  for (const question of questions) {
    const answered = answers[question.id];
    const isCorrect = answered !== undefined && answered === question.correctIndex;

    const entry = breakdownMap.get(question.category) ?? {
      category: question.category,
      correct: 0,
      total: 0,
    };
    entry.total += 1;
    if (isCorrect) {
      correct += 1;
      entry.correct += 1;
    }
    if (answered === undefined) {
      unanswered += 1;
    }
    breakdownMap.set(question.category, entry);
  }

  const total = questions.length;
  const incorrect = total - correct - unanswered;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 1000) / 10;

  return {
    score: correct,
    total,
    percentage,
    correct,
    incorrect,
    unanswered,
    breakdown: [...breakdownMap.values()].sort((a, b) => b.total - a.total),
  };
}
