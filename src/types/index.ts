export type Difficulty = 'facil' | 'media' | 'dificil';

export interface UserProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  updatedAt: number;
}

export interface TopicMastery {
  id: string;
  area: string;
  mastered: boolean;
  updatedAt: number;
}

export interface CustomFlashcard {
  id: string;
  category: string;
  question: string;
  answer: string;
  difficulty: Difficulty;
  reviewCount: number;
  createdAt: number;
}

export interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  category: string;
  feedback?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: ExamQuestion[];
  durationMinutes: number;
}

export interface ExamBreakdown {
  category: string;
  correct: number;
  total: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  answers: Record<string, number>;
  score: number;
  breakdown: ExamBreakdown[];
  timeSpentSeconds: number;
  date: number;
}

export interface SyncOutboxEntry {
  id: string;
  clientToken: string;
  entity: 'progress' | 'flashcards' | 'examAttempts';
  action: 'create' | 'update' | 'delete';
  payload: Record<string, unknown>;
  status: 'pending' | 'synced' | 'failed';
  createdAt: number;
}
