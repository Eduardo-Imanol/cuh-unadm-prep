export type AIProvider = 'openrouter' | 'openai' | 'gemini';

export interface AIQuestionPayload {
  topic: string;
  count: number;
}

export interface AIQuestionResult {
  text: string;
  options: string[];
  correctIndex: number;
}

export interface AIFeedbackPayload {
  topic: string;
  score: number;
  total: number;
  weakAreas: string[];
}

export interface AIFeedbackResult {
  summary: string;
  tips: string[];
  usedFallback: boolean;
}

export interface AIServiceError {
  message: string;
  code: 'NO_KEY' | 'NETWORK' | 'RATE_LIMIT' | 'INVALID_RESPONSE';
}

export interface AIQuestionFeedbackPayload {
  topic: string;
  question: string;
  options: string[];
  userAnswerIndex: number | undefined;
  correctIndex: number;
}

export interface AIQuestionFeedbackResult {
  explanation: string;
  usedFallback: boolean;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ProviderAdapter {
  id: AIProvider;
  label: string;
  placeholder: string;
  model: string;
  endpoint: string;
  buildHeaders: (apiKey: string) => Record<string, string>;
  buildBody: (messages: ChatMessage[], jsonMode: boolean) => unknown;
  parseContent: (data: unknown) => string | undefined;
}

function parseOpenAiContent(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null) {
    return undefined;
  }
  const choices = (data as { choices?: unknown }).choices;
  if (!Array.isArray(choices)) {
    return undefined;
  }
  const content = (choices[0] as { message?: { content?: unknown } } | undefined)?.message?.content;
  return typeof content === 'string' ? content : undefined;
}

function parseGeminiContent(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null) {
    return undefined;
  }
  const root = data as { steps?: unknown; candidates?: unknown };

  const texts: string[] = [];

  if (Array.isArray(root.steps)) {
    for (const step of root.steps) {
      if ((step as { type?: unknown }).type !== 'model_output') {
        continue;
      }
      const content = (step as { content?: unknown }).content;
      if (!Array.isArray(content)) {
        continue;
      }
      for (const part of content) {
        const text = (part as { text?: unknown }).text;
        if (typeof text === 'string' && text.trim().length > 0) {
          texts.push(text.trim());
        }
      }
    }
  }

  if (Array.isArray(root.candidates)) {
    const parts = (root.candidates[0] as { content?: { parts?: unknown } } | undefined)?.content?.parts;
    if (Array.isArray(parts)) {
      for (const part of parts) {
        const text = (part as { text?: unknown }).text;
        if (typeof text === 'string' && text.trim().length > 0) {
          texts.push(text.trim());
        }
      }
    }
  }

  const joined = texts.join('\n').trim();
  return joined.length > 0 ? joined : undefined;
}

function openAiBody(model: string, messages: ChatMessage[], jsonMode: boolean): unknown {
  return {
    model,
    messages,
    ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
  };
}

function toGeminiContents(
  messages: ChatMessage[],
): Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> {
  const merged: Array<{ role: 'user' | 'model'; text: string }> = [];

  for (const message of messages) {
    if (message.role === 'system') {
      continue;
    }
    const role = message.role === 'assistant' ? 'model' : 'user';
    const last = merged[merged.length - 1];
    if (last && last.role === role) {
      last.text = `${last.text}\n\n${message.content}`;
    } else {
      merged.push({ role, text: message.content });
    }
  }

  return merged.map((entry) => ({ role: entry.role, parts: [{ text: entry.text }] }));
}

const PROVIDER_ADAPTERS: Record<AIProvider, ProviderAdapter> = {
  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    placeholder: 'sk-or-v1-…',
    model: 'openai/gpt-4o-mini',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    buildHeaders: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    buildBody: (messages, jsonMode) => openAiBody('openai/gpt-4o-mini', messages, jsonMode),
    parseContent: parseOpenAiContent,
  },
  openai: {
    id: 'openai',
    label: 'OpenAI',
    placeholder: 'sk-…',
    model: 'gpt-4o-mini',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    buildHeaders: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    buildBody: (messages, jsonMode) => openAiBody('gpt-4o-mini', messages, jsonMode),
    parseContent: parseOpenAiContent,
  },
  gemini: {
    id: 'gemini',
    label: 'Google Gemini',
    placeholder: 'AIza…',
    model: 'gemini-3.6-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
    buildHeaders: (apiKey) => ({
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    }),
    buildBody: (messages, jsonMode) => {
      const system = messages
        .filter((message) => message.role === 'system')
        .map((message) => message.content)
        .join('\n\n');
      return {
        systemInstruction: system.length > 0 ? { parts: [{ text: system }] } : undefined,
        contents: toGeminiContents(messages),
        ...(jsonMode ? { generationConfig: { responseMimeType: 'application/json' } } : {}),
      };
    },
    parseContent: parseGeminiContent,
  },
};

export const AI_PROVIDERS = Object.values(PROVIDER_ADAPTERS).map((adapter) => ({
  id: adapter.id,
  label: adapter.label,
  placeholder: adapter.placeholder,
}));

export const OPENAI_URL = PROVIDER_ADAPTERS.openai.endpoint;

const SYSTEM_PROMPT =
  'Eres un generador de preguntas de opción múltiple para el Examen CUH de la UnADM. ' +
  'Responde SOLO con JSON válido: {"questions":[{"text":string,"options":string[] x4,"correctIndex":number}]}.';

const FEEDBACK_SYSTEM_PROMPT =
  'Eres un tutor experto para el Examen CUH de la UnADM. ' +
  'Responde SOLO con JSON válido: {"summary":string,"tips":string[]}.';

const QUESTION_FEEDBACK_SYSTEM_PROMPT =
  'Eres un tutor experto para el Examen CUH de la UnADM. ' +
  'Responde SOLO con JSON válido: {"explanation":string}.';

function buildPrompt(payload: AIQuestionPayload): string {
  return `Genera ${payload.count} preguntas de opción múltiple sobre "${payload.topic}" ` +
    'con 4 opciones cada una y correctIndex indicando la opción correcta.';
}

function buildFeedbackPrompt(payload: AIFeedbackPayload): string {
  const weak = payload.weakAreas.length > 0
    ? `Áreas débiles: ${payload.weakAreas.join(', ')}.`
    : 'Sin áreas débiles específicas.';
  return `El estudiante obtuvo ${payload.score} de ${payload.total} en "${payload.topic}". ` +
    `${weak} Da un resumen breve de 2 frases y 3 consejos de estudio concretos.`;
}

export function buildStaticFeedback(payload: AIFeedbackPayload): AIFeedbackResult {
  const ratio = payload.total > 0 ? payload.score / payload.total : 0;
  const percentage = Math.round(ratio * 100);

  let summary: string;
  if (ratio >= 0.8) {
    summary = `Excelente desempeño en "${payload.topic}" con ${percentage}% de aciertos. Sigue así.`;
  } else if (ratio >= 0.6) {
    summary = `Buen avance en "${payload.topic}" con ${percentage}% de aciertos. Un poco más de repaso lo dominas.`;
  } else {
    summary = `Tu puntaje en "${payload.topic}" fue de ${percentage}%. Recomiendo repasar los fundamentos antes de continuar.`;
  }

  const tips = [
    `Repasa los conceptos clave de "${payload.topic}" en las lecciones correspondientes.`,
    'Practica con las flashcards de la sección de memorización. ',
    'Vuelve a intentar el simulador en un par de días para medir tu avance.',
  ];

  if (payload.weakAreas.length > 0) {
    tips.unshift(`Dedica tiempo extra a: ${payload.weakAreas.join(', ')}.`);
  }

  return { summary, tips, usedFallback: true };
}

function buildQuestionFeedbackPrompt(payload: AIQuestionFeedbackPayload): string {
  const label = (index: number): string => `${String.fromCharCode(65 + index)}. ${payload.options[index] ?? ''}`;
  const userOption =
    payload.userAnswerIndex !== undefined
      ? label(payload.userAnswerIndex)
      : 'No respondió';
  const correctOption = label(payload.correctIndex);
  const options = payload.options.map((_, index) => label(index)).join(' | ');

  return `Área: ${payload.topic}.\n` +
    `Pregunta: "${payload.question}"\n` +
    `Opciones: ${options}\n` +
    `Respuesta del estudiante: ${userOption}\n` +
    `Respuesta correcta: ${correctOption}\n` +
    'Explica en 2 o 3 frases por qué la respuesta correcta es válida y, si el estudiante se equivocó o no respondió, por qué su respuesta no es correcta. Sé claro y pedagógico.';
}

export function buildStaticQuestionFeedback(
  feedback: string | undefined,
): AIQuestionFeedbackResult {
  const explanation =
    feedback && feedback.trim().length > 0
      ? feedback
      : 'Revisa el concepto relacionado en la guía de estudio y vuelve a intentarlo.';
  return { explanation, usedFallback: true };
}

async function isOnline(): Promise<boolean> {
  return typeof navigator !== 'undefined' ? navigator.onLine : false;
}

class ChatCompletionError extends Error {
  status: number;
  apiMessage: string | undefined;

  constructor(status: number, apiMessage: string | undefined) {
    super(apiMessage ?? `API responded with status ${status}`);
    this.status = status;
    this.apiMessage = apiMessage;
  }
}

function isAbortError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { name?: unknown }).name === 'AbortError';
}

async function fetchChatCompletion(
  messages: ChatMessage[],
  apiKey: string,
  provider: AIProvider,
  jsonMode: boolean,
): Promise<string | undefined> {
  const adapter = PROVIDER_ADAPTERS[provider];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    let res: Response;
    try {
      res = await fetch(adapter.endpoint, {
        method: 'POST',
        headers: adapter.buildHeaders(apiKey),
        body: JSON.stringify(adapter.buildBody(messages, jsonMode)),
        signal: controller.signal,
      });
    } catch (error) {
      if (isAbortError(error)) {
        throw error;
      }
      throw new ChatCompletionError(
        0,
        'No se pudo contactar a la API. Revisa tu conexión o los permisos CORS de tu key.',
      );
    }

    if (!res.ok) {
      let apiMessage: string | undefined;
      try {
        const body = (await res.json()) as unknown;
        const message = (body as { error?: { message?: unknown } }).error?.message;
        if (typeof message === 'string' && message.trim().length > 0) {
          apiMessage = message.trim();
        }
      } catch {
        apiMessage = undefined;
      }
      throw new ChatCompletionError(res.status, apiMessage);
    }

    const data = (await res.json()) as unknown;
    return adapter.parseContent(data);
  } finally {
    clearTimeout(timeout);
  }
}

export async function getFeedback(
  payload: AIFeedbackPayload,
  apiKey: string | undefined,
  provider: AIProvider = 'openrouter',
): Promise<AIFeedbackResult> {
  if (!apiKey?.trim() || !(await isOnline())) {
    return buildStaticFeedback(payload);
  }

  try {
    const content = await fetchChatCompletion(
      [
        { role: 'system', content: FEEDBACK_SYSTEM_PROMPT },
        { role: 'user', content: buildFeedbackPrompt(payload) },
      ],
      apiKey,
      provider,
      true,
    );

    if (!content) {
      return buildStaticFeedback(payload);
    }

    const parsed = JSON.parse(content) as { summary?: string; tips?: string[] };
    if (typeof parsed.summary !== 'string' || !Array.isArray(parsed.tips)) {
      return buildStaticFeedback(payload);
    }

    return {
      summary: parsed.summary,
      tips: parsed.tips.filter((tip): tip is string => typeof tip === 'string'),
      usedFallback: false,
    };
  } catch {
    return buildStaticFeedback(payload);
  }
}

export async function getQuestionFeedback(
  payload: AIQuestionFeedbackPayload,
  apiKey: string | undefined,
  fallbackExplanation: string | undefined,
  provider: AIProvider = 'openrouter',
): Promise<AIQuestionFeedbackResult> {
  if (!apiKey?.trim() || !(await isOnline())) {
    return buildStaticQuestionFeedback(fallbackExplanation);
  }

  try {
    const content = await fetchChatCompletion(
      [
        { role: 'system', content: QUESTION_FEEDBACK_SYSTEM_PROMPT },
        { role: 'user', content: buildQuestionFeedbackPrompt(payload) },
      ],
      apiKey,
      provider,
      true,
    );

    if (!content) {
      return buildStaticQuestionFeedback(fallbackExplanation);
    }

    const parsed = JSON.parse(content) as { explanation?: string };
    if (typeof parsed.explanation !== 'string' || parsed.explanation.trim().length === 0) {
      return buildStaticQuestionFeedback(fallbackExplanation);
    }

    return { explanation: parsed.explanation.trim(), usedFallback: false };
  } catch {
    return buildStaticQuestionFeedback(fallbackExplanation);
  }
}

export async function generateQuestions(
  payload: AIQuestionPayload,
  apiKey: string,
  provider: AIProvider = 'openrouter',
): Promise<AIQuestionResult[]> {
  if (!apiKey.trim()) {
    throw { message: 'No se configuró una API key.', code: 'NO_KEY' } satisfies AIServiceError;
  }

  try {
    const content = await fetchChatCompletion(
      [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildPrompt(payload) },
      ],
      apiKey,
      provider,
      true,
    );

    if (!content) {
      throw { message: 'La API no devolvió contenido.', code: 'INVALID_RESPONSE' } satisfies AIServiceError;
    }

    const parsed = JSON.parse(content) as { questions?: AIQuestionResult[] };
    const questions = parsed.questions ?? [];
    if (questions.length === 0) {
      throw { message: 'La API devolvió una lista vacía.', code: 'INVALID_RESPONSE' } satisfies AIServiceError;
    }
    return questions;
  } catch (error) {
    if (isAbortError(error)) {
      throw { message: 'La solicitud tardó demasiado.', code: 'NETWORK' } satisfies AIServiceError;
    }
    if (error instanceof ChatCompletionError) {
      throw {
        message: error.apiMessage ?? `La API respondió con estado ${error.status}.`,
        code: error.status === 429 ? 'RATE_LIMIT' : 'NETWORK',
      } satisfies AIServiceError;
    }
    throw error;
  }
}

export async function chatWithAI(
  messages: ChatMessage[],
  apiKey: string,
  provider: AIProvider = 'openrouter',
): Promise<string> {
  if (!apiKey.trim()) {
    throw { message: 'No se configuró una API key.', code: 'NO_KEY' } satisfies AIServiceError;
  }

  try {
    const content = await fetchChatCompletion(messages, apiKey, provider, false);
    if (!content) {
      throw { message: 'La IA no devolvió contenido.', code: 'INVALID_RESPONSE' } satisfies AIServiceError;
    }
    return content;
  } catch (error) {
    if (isAbortError(error)) {
      throw { message: 'La solicitud tardó demasiado.', code: 'NETWORK' } satisfies AIServiceError;
    }
    if (error instanceof ChatCompletionError) {
      throw {
        message: error.apiMessage ?? `La API respondió con estado ${error.status}.`,
        code: error.status === 429 ? 'RATE_LIMIT' : 'NETWORK',
      } satisfies AIServiceError;
    }
    throw error;
  }
}
