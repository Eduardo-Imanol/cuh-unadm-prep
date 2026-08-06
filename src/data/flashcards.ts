import { getExamAreaByLabel } from '@/data/exams';
import { EXAMEN_2_QUESTIONS } from '@/data/exams/questions/examen2';
import { EXAMEN_3_QUESTIONS } from '@/data/exams/questions/examen3';
import { EXAMEN_4_QUESTIONS } from '@/data/exams/questions/examen4';
import type { ExamQuestion } from '@/types';

export interface FlashcardEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
  source: string;
}

const EXAM_BANKS: Record<string, ExamQuestion[]> = {
  'examen-2': EXAMEN_2_QUESTIONS,
  'examen-3': EXAMEN_3_QUESTIONS,
  'examen-4': EXAMEN_4_QUESTIONS,
};

function buildAnswer(question: ExamQuestion): string {
  const correctOption = question.options[question.correctIndex] ?? '';
  return question.feedback !== undefined
    ? `${correctOption}. ${question.feedback}`
    : correctOption;
}

function buildCard(examId: string, question: ExamQuestion): FlashcardEntry {
  const area = getExamAreaByLabel(question.category);
  return {
    id: `${examId}-${question.id}`,
    category: area?.label ?? question.category,
    question: question.text,
    answer: buildAnswer(question),
    source: examId,
  };
}

export function getFlashcardEntries(): FlashcardEntry[] {
  const cards: FlashcardEntry[] = [];
  for (const [examId, questions] of Object.entries(EXAM_BANKS)) {
    for (const question of questions) {
      const area = getExamAreaByLabel(question.category);
      if (area?.id === 'especifica') {
        continue;
      }
      cards.push(buildCard(examId, question));
    }
  }
  return cards;
}

export function getFlashcardCategories(): string[] {
  const categories = new Set(getFlashcardEntries().map((card) => card.category));
  return [...categories];
}
