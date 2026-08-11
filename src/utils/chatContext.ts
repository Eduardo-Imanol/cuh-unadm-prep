import { getExamMeta } from '@/data/exams';

export interface PageContext {
  title: string;
  description: string;
  detail?: string;
}

export function getPageContext(pathname: string): PageContext {
  const examMatch = /^\/examenes\/([^/]+)\/?$/.exec(pathname);
  if (examMatch?.[1]) {
    const exam = getExamMeta(examMatch[1]);
    if (exam) {
      return {
        title: `Simulacro: ${exam.title}`,
        description:
          'El estudiante está resolviendo un simulacro de examen en vivo. ' +
          'Puede pedir aclaraciones de conceptos, resolver dudas de reactivos o repasar temas, pero no reveles la respuesta correcta directamente: guíalo con pistas pedagógicas.',
      };
    }
  }

  switch (pathname) {
    case '/':
      return {
        title: 'Dashboard (Inicio)',
        description:
          'El estudiante ve su panel con avance global, probabilidad de aprobar, materias y su siguiente paso sugerido.',
      };
    case '/examenes':
      return {
        title: 'Catálogo de exámenes',
        description:
          'El estudiante elige entre simulacros del Examen CUH de la UnADM con distintas dificultades y coberturas.',
      };
    case '/flashcards':
      return {
        title: 'Flashcards',
        description:
          'El estudiante repasa tarjetas de memorización de conceptos clave para el Examen CUH.',
      };
    case '/ruta-aprendizaje':
      return {
        title: 'Ruta de aprendizaje',
        description:
          'El estudiante navega el temario completo del Examen CUH y marca subtemas como dominados.',
      };
    case '/config-ia':
      return {
        title: 'Configuración de IA',
        description:
          'El estudiante administra su API key y el proveedor de IA (OpenRouter, OpenAI o Gemini).',
      };
    default:
      return {
        title: 'Página de la aplicación CUH',
        description:
          'El estudiante está navegando la app de preparación para el Examen CUH de la UnADM.',
      };
  }
}

export const CHAT_SYSTEM_PROMPT =
  'Eres "Tutor CUH", un asistente experto para preparar el Examen CUH de la UnADM. ' +
  'Ayudas a resolver dudas, explicas conceptos, sugieres estrategias de estudio y aclaras preguntas de cualquier área ' +
  '(Español, Pensamiento Matemático, Habilidades Digitales, Ambientes Virtuales, etc.). ' +
  'Responde siempre en español, de forma concisa y pedagógica (2 a 4 frases salvo que te pidan más). ' +
  'Nunca salgas del ámbito de estudio y sé honesto cuando no sepas algo.';

export function buildChatSystemMessage(context: PageContext): string {
  const detailLine =
    context.detail !== undefined && context.detail.trim().length > 0
      ? `\n- Detalle actual: ${context.detail}`
      : '';
  return (
    `${CHAT_SYSTEM_PROMPT}\n\n` +
    `La página que el estudiante está viendo ahora:\n` +
    `- Título: ${context.title}\n` +
    `- Descripción: ${context.description}` +
    detailLine
  );
}
