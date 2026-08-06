import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildStaticFeedback,
  buildStaticQuestionFeedback,
  getFeedback,
  getQuestionFeedback,
} from './aiService';

const payload = {
  topic: 'Matemáticas',
  score: 7,
  total: 10,
  weakAreas: ['Álgebra'],
};

const questionPayload = {
  topic: 'Matemáticas',
  question: '¿Cuánto es 2 + 2?',
  options: ['3', '4', '5', '6'],
  userAnswerIndex: 0,
  correctIndex: 1,
};

describe('buildStaticFeedback', () => {
  it('marks result as fallback', () => {
    const result = buildStaticFeedback(payload);
    expect(result.usedFallback).toBe(true);
  });

  it('returns three study tips plus one weak-area tip', () => {
    const result = buildStaticFeedback(payload);
    expect(result.tips).toHaveLength(4);
    expect(result.tips[0]).toContain('Álgebra');
  });

  it('summarizes based on score ratio', () => {
    const good = buildStaticFeedback({ ...payload, score: 9, total: 10 });
    expect(good.summary).toContain('90%');

    const bad = buildStaticFeedback({ ...payload, score: 3, total: 10 });
    expect(bad.summary).toContain('30%');
  });

  it('handles total of zero without dividing by zero', () => {
    const result = buildStaticFeedback({ ...payload, score: 0, total: 0 });
    expect(result.summary).toBeTruthy();
  });
});

describe('buildStaticQuestionFeedback', () => {
  it('uses the bank feedback when present', () => {
    const result = buildStaticQuestionFeedback('La opción B es correcta porque…');
    expect(result).toEqual({
      explanation: 'La opción B es correcta porque…',
      usedFallback: true,
    });
  });

  it('falls back to a generic message when no feedback exists', () => {
    const result = buildStaticQuestionFeedback(undefined);
    expect(result.usedFallback).toBe(true);
    expect(result.explanation.length).toBeGreaterThan(0);
  });
});

describe('getQuestionFeedback', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  it('returns static fallback when no api key', async () => {
    const result = await getQuestionFeedback(questionPayload, undefined, 'guía');
    expect(result).toEqual({ explanation: 'guía', usedFallback: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns static fallback when offline', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    const result = await getQuestionFeedback(questionPayload, 'sk-test', 'guía');
    expect(result.usedFallback).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns static fallback when the API fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 429 });
    const result = await getQuestionFeedback(questionPayload, 'sk-test', 'guía');
    expect(result).toEqual({ explanation: 'guía', usedFallback: true });
  });

  it('returns parsed AI feedback when the API succeeds', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '{"explanation":"Porque 2 + 2 = 4"}' } }],
      }),
    });
    const result = await getQuestionFeedback(questionPayload, 'sk-test', 'guía');
    expect(result).toEqual({
      explanation: 'Porque 2 + 2 = 4',
      usedFallback: false,
    });
  });

  it('sends the API key as a bearer token', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '{"explanation":"x"}' } }],
      }),
    });

    await getQuestionFeedback(questionPayload, 'sk-secreto', undefined);

    const [url, init] = fetchMock.mock.calls[0] as [string, { headers: Record<string, string> }];
    expect(url).toContain('openrouter.ai');
    expect(init.headers.Authorization).toBe('Bearer sk-secreto');
  });
});

describe('getFeedback', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  it('returns static fallback when no api key', async () => {
    const result = await getFeedback(payload, undefined);
    expect(result.usedFallback).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns static fallback when offline', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    const result = await getFeedback(payload, 'sk-test');
    expect(result.usedFallback).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns static fallback when the API responds with an error', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });
    const result = await getFeedback(payload, 'sk-test');
    expect(result.usedFallback).toBe(true);
  });

  it('returns static fallback when the payload is invalid JSON', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'not-json{' } }] }),
    });
    const result = await getFeedback(payload, 'sk-test');
    expect(result.usedFallback).toBe(true);
  });

  it('returns parsed AI feedback when the API succeeds', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '{"summary":"Buen trabajo","tips":["Repasa","Practica"]}' } }],
      }),
    });
    const result = await getFeedback(payload, 'sk-test');
    expect(result).toEqual({
      summary: 'Buen trabajo',
      tips: ['Repasa', 'Practica'],
      usedFallback: false,
    });
  });

  it('sends the API key as a bearer token', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '{"summary":"s","tips":[]}' } }],
      }),
    });

    await getFeedback(payload, 'sk-secreto');

    const [url, init] = fetchMock.mock.calls[0] as [string, { headers: Record<string, string> }];
    expect(url).toContain('openrouter.ai');
    expect(init.headers.Authorization).toBe('Bearer sk-secreto');
  });
});
