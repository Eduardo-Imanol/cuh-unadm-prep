import Dexie, { type EntityTable } from 'dexie';
import type {
  CustomFlashcard,
  ExamAttempt,
  SyncOutboxEntry,
  TopicMastery,
  UserProgress,
} from '@/types';

export class CUHDatabase extends Dexie {
  progress!: EntityTable<UserProgress, 'lessonId'>;
  topicMastery!: EntityTable<TopicMastery, 'id'>;
  flashcards!: EntityTable<CustomFlashcard, 'id'>;
  examAttempts!: EntityTable<ExamAttempt, 'id'>;
  outbox!: EntityTable<SyncOutboxEntry, 'id'>;

  constructor() {
    super('cuh-unadm-prep');
    this.version(1).stores({
      progress: 'lessonId, updatedAt',
      flashcards: 'id, category, difficulty, createdAt',
      examAttempts: 'id, examId, date',
      outbox: 'id, status, createdAt',
    });
    this.version(2).stores({
      topicMastery: 'id, area, updatedAt',
    });
  }
}

export const db = new CUHDatabase();

let lastSyncTimestamp = 0;

function nextSyncTimestamp(): number {
  const now = Date.now();
  lastSyncTimestamp = Math.max(now, lastSyncTimestamp + 1);
  return lastSyncTimestamp;
}

export async function getProgress(lessonId: string): Promise<UserProgress | undefined> {
  return db.progress.get(lessonId);
}

export async function getAllProgress(): Promise<UserProgress[]> {
  return db.progress.toArray();
}

export async function saveProgress(
  lessonId: string,
  patch: Pick<UserProgress, 'completed' | 'score'>,
): Promise<void> {
  await db.progress.put({
    lessonId,
    completed: patch.completed,
    score: patch.score,
    updatedAt: Date.now(),
  });
}

export async function getTopicMastery(id: string): Promise<TopicMastery | undefined> {
  return db.topicMastery.get(id);
}

export async function getAllTopicMastery(): Promise<TopicMastery[]> {
  return db.topicMastery.toArray();
}

export async function setTopicMastered(id: string, area: string, mastered: boolean): Promise<void> {
  await db.topicMastery.put({
    id,
    area,
    mastered,
    updatedAt: Date.now(),
  });
}

export async function getFlashcard(id: string): Promise<CustomFlashcard | undefined> {
  return db.flashcards.get(id);
}

export async function getAllFlashcards(): Promise<CustomFlashcard[]> {
  return db.flashcards.orderBy('createdAt').toArray();
}

export async function getFlashcardsByCategory(category: string): Promise<CustomFlashcard[]> {
  return db.flashcards.where('category').equals(category).toArray();
}

export async function addFlashcard(card: Omit<CustomFlashcard, 'id' | 'reviewCount' | 'createdAt'>): Promise<string> {
  const id = crypto.randomUUID();
  const now = nextSyncTimestamp();
  await db.flashcards.add({
    id,
    ...card,
    reviewCount: 0,
    createdAt: now,
  });
  return id;
}

export async function updateFlashcard(
  id: string,
  patch: Partial<Omit<CustomFlashcard, 'id' | 'createdAt'>>,
): Promise<void> {
  await db.flashcards.update(id, patch);
}

export async function deleteFlashcard(id: string): Promise<void> {
  await db.flashcards.delete(id);
}

export async function getExamAttempt(id: string): Promise<ExamAttempt | undefined> {
  return db.examAttempts.get(id);
}

export async function getExamAttemptsByExam(examId: string): Promise<ExamAttempt[]> {
  return db.examAttempts.where('examId').equals(examId).reverse().sortBy('date');
}

export async function getAllExamAttempts(): Promise<ExamAttempt[]> {
  return db.examAttempts.orderBy('date').reverse().toArray();
}

export async function addExamAttempt(
  attempt: Omit<ExamAttempt, 'id' | 'date'>,
): Promise<string> {
  const id = crypto.randomUUID();
  await db.examAttempts.add({
    id,
    ...attempt,
    date: Date.now(),
  });
  return id;
}

export async function deleteExamAttempt(id: string): Promise<void> {
  await db.examAttempts.delete(id);
}

export async function enqueueSync(
  entry: Omit<SyncOutboxEntry, 'id' | 'status' | 'createdAt'>,
): Promise<string> {
  const id = crypto.randomUUID();
  await db.outbox.add({
    id,
    ...entry,
    status: 'pending',
    createdAt: nextSyncTimestamp(),
  });
  return id;
}

export async function getPendingSyncEntries(): Promise<SyncOutboxEntry[]> {
  return db.outbox.where('status').equals('pending').sortBy('createdAt');
}

export async function markSyncEntrySynced(id: string): Promise<void> {
  await db.outbox.update(id, { status: 'synced' });
}

export async function deleteSyncEntry(id: string): Promise<void> {
  await db.outbox.delete(id);
}
