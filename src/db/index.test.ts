import { beforeEach, describe, expect, it } from 'vitest';
import {
  db,
  addExamAttempt,
  addFlashcard,
  deleteExamAttempt,
  deleteFlashcard,
  enqueueSync,
  getAllExamAttempts,
  getAllFlashcards,
  getAllProgress,
  getAllTopicMastery,
  getExamAttemptsByExam,
  getFlashcard,
  getFlashcardsByCategory,
  getPendingSyncEntries,
  getProgress,
  getTopicMastery,
  markSyncEntrySynced,
  saveProgress,
  setTopicMastered,
  updateFlashcard,
} from './index';
import type { Difficulty } from '@/types';

async function resetDb(): Promise<void> {
  await db.transaction(
    'rw',
    db.progress,
    db.topicMastery,
    db.flashcards,
    db.examAttempts,
    db.outbox,
    async () => {
      await db.progress.clear();
      await db.topicMastery.clear();
      await db.flashcards.clear();
      await db.examAttempts.clear();
      await db.outbox.clear();
    },
  );
}

const cardInput = {
  category: 'Matemáticas',
  question: '¿Qué es 2 + 2?',
  answer: '4',
  difficulty: 'facil' as Difficulty,
};

describe('progress', () => {
  beforeEach(resetDb);

  it('saves and retrieves progress by lessonId', async () => {
    await saveProgress('l1', { completed: true, score: 80 });
    const progress = await getProgress('l1');

    expect(progress).toMatchObject({ lessonId: 'l1', completed: true, score: 80 });
  });

  it('upserts existing progress keeping one record', async () => {
    await saveProgress('l1', { completed: false, score: 40 });
    await saveProgress('l1', { completed: true, score: 90 });

    const all = await getAllProgress();
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ lessonId: 'l1', score: 90 });
  });

  it('stamps updatedAt on write', async () => {
    await saveProgress('l1', { completed: true, score: 50 });
    const progress = await getProgress('l1');

    expect(progress?.updatedAt).toBeTypeOf('number');
    expect(progress?.updatedAt).toBeGreaterThan(0);
  });
});

describe('topic mastery', () => {
  beforeEach(resetDb);

  it('marks a topic as mastered and retrieves it', async () => {
    await setTopicMastered('topic-1', 'espanol', true);

    const record = await getTopicMastery('topic-1');
    expect(record).toMatchObject({ id: 'topic-1', area: 'espanol', mastered: true });
  });

  it('returns only mastered topics', async () => {
    await setTopicMastered('topic-1', 'espanol', true);
    await setTopicMastered('topic-2', 'matematicas', false);

    const all = await getAllTopicMastery();
    expect(all.filter((record) => record.mastered).map((record) => record.id)).toEqual(['topic-1']);
  });

  it('toggles mastery off by overwriting the record', async () => {
    await setTopicMastered('topic-1', 'espanol', true);
    await setTopicMastered('topic-1', 'espanol', false);

    expect((await getTopicMastery('topic-1'))?.mastered).toBe(false);
  });
});

describe('flashcards', () => {
  beforeEach(resetDb);

  it('adds a flashcard with defaults and returns its id', async () => {
    const id = await addFlashcard(cardInput);
    const card = await getFlashcard(id);

    expect(card).toMatchObject({ ...cardInput, reviewCount: 0 });
    expect(card?.createdAt).toBeTypeOf('number');
  });

  it('orders cards by createdAt ascending', async () => {
    await addFlashcard({ ...cardInput, category: 'A' });
    await addFlashcard({ ...cardInput, category: 'B' });

    const cards = await getAllFlashcards();
    expect(cards.map((card) => card.category)).toEqual(['A', 'B']);
  });

  it('filters cards by category', async () => {
    await addFlashcard({ ...cardInput, category: 'Matemáticas' });
    await addFlashcard({ ...cardInput, category: 'Español' });

    const cards = await getFlashcardsByCategory('Español');
    expect(cards).toHaveLength(1);
    expect(cards[0]?.category).toBe('Español');
  });

  it('updates a card without touching id or createdAt', async () => {
    const id = await addFlashcard(cardInput);
    await updateFlashcard(id, { answer: 'Cuatro' });

    const card = await getFlashcard(id);
    expect(card?.answer).toBe('Cuatro');
    expect(card?.id).toBe(id);
  });

  it('deletes a card', async () => {
    const id = await addFlashcard(cardInput);
    await deleteFlashcard(id);

    expect(await getFlashcard(id)).toBeUndefined();
  });
});

describe('examAttempts', () => {
  beforeEach(resetDb);

  const attemptInput = {
    examId: 'exam-1',
    answers: { q1: 0, q2: 2 },
    score: 70,
    breakdown: [{ category: 'Matemáticas', correct: 1, total: 2 }],
    timeSpentSeconds: 900,
  };

  it('adds an attempt and returns its id', async () => {
    const id = await addExamAttempt(attemptInput);
    const attempt = await db.examAttempts.get(id);

    expect(attempt).toMatchObject(attemptInput);
    expect(attempt?.date).toBeTypeOf('number');
  });

  it('lists attempts of an exam newest first', async () => {
    await addExamAttempt(attemptInput);
    await new Promise((resolve) => setTimeout(resolve, 5));
    await addExamAttempt({ ...attemptInput, score: 95 });

    const attempts = await getExamAttemptsByExam('exam-1');
    expect(attempts.map((attempt) => attempt.score)).toEqual([95, 70]);
  });

  it('returns all attempts in reverse chronological order', async () => {
    await addExamAttempt({ ...attemptInput, examId: 'e1' });
    await new Promise((resolve) => setTimeout(resolve, 5));
    await addExamAttempt({ ...attemptInput, examId: 'e2' });

    const attempts = await getAllExamAttempts();
    expect(attempts.map((attempt) => attempt.examId)).toEqual(['e2', 'e1']);
  });

  it('deletes an attempt', async () => {
    const id = await addExamAttempt(attemptInput);
    await deleteExamAttempt(id);

    expect(await db.examAttempts.get(id)).toBeUndefined();
  });
});

describe('sync outbox', () => {
  beforeEach(resetDb);

  it('enqueues a pending entry with id and timestamp', async () => {
    const id = await enqueueSync({
      clientToken: 'ct-1',
      entity: 'progress',
      action: 'update',
      payload: { lessonId: 'l1' },
    });

    const entry = await db.outbox.get(id);
    expect(entry?.status).toBe('pending');
    expect(entry?.createdAt).toBeTypeOf('number');
  });

  it('returns pending entries FIFO', async () => {
    await enqueueSync({ clientToken: 'ct-1', entity: 'flashcards', action: 'create', payload: {} });
    await enqueueSync({ clientToken: 'ct-2', entity: 'flashcards', action: 'create', payload: {} });

    const pending = await getPendingSyncEntries();
    expect(pending.map((entry) => entry.clientToken)).toEqual(['ct-1', 'ct-2']);
  });

  it('marks an entry as synced', async () => {
    const id = await enqueueSync({ clientToken: 'ct-1', entity: 'progress', action: 'update', payload: {} });

    await markSyncEntrySynced(id);

    const pending = await getPendingSyncEntries();
    expect(pending).toHaveLength(0);
  });
});
