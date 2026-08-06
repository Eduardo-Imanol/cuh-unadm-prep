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

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

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

export async function getFeedback(
  payload: AIFeedbackPayload,
  apiKey: string | undefined,
): Promise<AIFeedbackResult> {
  if (!apiKey?.trim() || !(await isOnline())) {
    return buildStaticFeedback(payload);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: FEEDBACK_SYSTEM_PROMPT },
          { role: 'user', content: buildFeedbackPrompt(payload) },
        ],
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return buildStaticFeedback(payload);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
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
  } finally {
    clearTimeout(timeout);
  }
}

export async function getQuestionFeedback(
  payload: AIQuestionFeedbackPayload,
  apiKey: string | undefined,
  fallbackExplanation: string | undefined,
): Promise<AIQuestionFeedbackResult> {
  if (!apiKey?.trim() || !(await isOnline())) {
    return buildStaticQuestionFeedback(fallbackExplanation);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: QUESTION_FEEDBACK_SYSTEM_PROMPT },
          { role: 'user', content: buildQuestionFeedbackPrompt(payload) },
        ],
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return buildStaticQuestionFeedback(fallbackExplanation);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
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
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateQuestions(
  payload: AIQuestionPayload,
  apiKey: string,
): Promise<AIQuestionResult[]> {
  if (!apiKey.trim()) {
    throw { message: 'No se configuró una API key.', code: 'NO_KEY' } satisfies AIServiceError;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildPrompt(payload) },
        ],
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw {
        message: `La API respondió con estado ${res.status}.`,
        code: res.status === 429 ? 'RATE_LIMIT' : 'NETWORK',
      } satisfies AIServiceError;
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
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
    if (error instanceof Error && error.name === 'AbortError') {
      throw { message: 'La solicitud tardó demasiado.', code: 'NETWORK' } satisfies AIServiceError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export { OPENAI_URL };
