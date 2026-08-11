import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildStaticFeedback,
  buildStaticQuestionFeedback,
  chatWithAI,
  generateQuestions,
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

describe('Gemini provider', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
  });

  it('uses the Gemini generateContent endpoint and x-goog-api-key header', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{"summary":"ok","tips":["a"]}' }] } }],
      }),
    });

    const result = await getFeedback(payload, 'AIza-fake', 'gemini');

    const [url, init] = fetchMock.mock.calls[0] as [string, { headers: Record<string, string> }];
    expect(url).toContain('/v1beta/models/gemini-3.6-flash:generateContent');
    expect(init.headers['x-goog-api-key']).toBe('AIza-fake');
    expect(init.headers.Authorization).toBeUndefined();
    expect(result.usedFallback).toBe(false);
  });

  it('sends contents format with system instruction and JSON mode in the body', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{"summary":"s","tips":[]}' }] } }],
      }),
    });

    await getFeedback(payload, 'AIza-fake', 'gemini');

    const [, init] = fetchMock.mock.calls[0] as [string, { body: string }];
    const body = JSON.parse(init.body) as {
      systemInstruction: { parts: Array<{ text: string }> };
      contents: Array<{ role: string; parts: Array<{ text: string }> }>;
      generationConfig: { responseMimeType: string };
    };
    expect(body.systemInstruction.parts[0]?.text).toBeTruthy();
    expect(body.contents[0]?.role).toBe('user');
    expect(body.generationConfig.responseMimeType).toBe('application/json');
  });

  it('parses Gemini candidates response for question feedback', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{"explanation":"Porque gemini dice"}' }] } }],
      }),
    });

    const result = await getQuestionFeedback(questionPayload, 'AIza-fake', undefined, 'gemini');
    expect(result).toEqual({ explanation: 'Porque gemini dice', usedFallback: false });
  });

  it('falls back to static feedback when Gemini returns no candidates', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    const result = await getQuestionFeedback(questionPayload, 'AIza-fake', 'guía', 'gemini');
    expect(result.usedFallback).toBe(true);
  });
});

describe('generateQuestions', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('throws NO_KEY when no api key is provided', async () => {
    await expect(generateQuestions({ topic: 'Tema', count: 1 }, '')).rejects.toMatchObject({
      code: 'NO_KEY',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns parsed questions on success', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: '{"questions":[{"text":"¿P?","options":["a","b","c","d"],"correctIndex":1}]}',
            },
          },
        ],
      }),
    });

    const questions = await generateQuestions({ topic: 'Tema', count: 1 }, 'sk-test');
    expect(questions).toHaveLength(1);
    expect(questions[0]?.correctIndex).toBe(1);
  });

  it('maps 429 to RATE_LIMIT error', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 429 });
    await expect(generateQuestions({ topic: 'Tema', count: 1 }, 'sk-test')).rejects.toMatchObject({
      code: 'RATE_LIMIT',
    });
  });

  it('surfaces the API error message from the response body', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ error: { message: 'API key not valid. Please pass a valid API key.' } }),
    });
    await expect(generateQuestions({ topic: 'Tema', count: 1 }, 'sk-test')).rejects.toMatchObject({
      code: 'NETWORK',
      message: 'API key not valid. Please pass a valid API key.',
    });
  });
});

describe('chatWithAI', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  const history = [
    { role: 'system' as const, content: 'Eres un tutor.' },
    { role: 'user' as const, content: '¿Qué es el CUH?' },
    { role: 'assistant' as const, content: 'Es un examen de admisión.' },
    { role: 'user' as const, content: '¿Qué áreas incluye?' },
  ];

  it('throws NO_KEY when no api key is provided', async () => {
    await expect(chatWithAI(history, '')).rejects.toMatchObject({ code: 'NO_KEY' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns the raw text for OpenAI-compatible providers', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Respuesta libre.' } }] }),
    });

    const reply = await chatWithAI(history, 'sk-test');
    expect(reply).toBe('Respuesta libre.');

    const [, init] = fetchMock.mock.calls[0] as [string, { body: string }];
    const body = JSON.parse(init.body) as { messages: Array<{ role: string }>; response_format?: unknown };
    expect(body.messages.map((message) => message.role)).toEqual(['system', 'user', 'assistant', 'user']);
    expect(body.response_format).toBeUndefined();
  });

  it('maps assistant messages to model role for Gemini and merges consecutive turns', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Respuesta gemini.' }] } }],
      }),
    });

    const reply = await chatWithAI(history, 'AIza-test', 'gemini');
    expect(reply).toBe('Respuesta gemini.');

    const [, init] = fetchMock.mock.calls[0] as [string, { body: string }];
    const body = JSON.parse(init.body) as {
      systemInstruction: { parts: Array<{ text: string }> };
      contents: Array<{ role: string }>;
    };
    expect(body.systemInstruction.parts[0]?.text).toBe('Eres un tutor.');
    expect(body.contents.map((content) => content.role)).toEqual(['user', 'model', 'user']);
  });
});
