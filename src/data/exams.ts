import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Calculator,
  Code2,
  FlaskConical,
  Globe,
  Landmark,
  Laptop,
} from 'lucide-react';
import type { Difficulty, ExamQuestion } from '@/types';
import { EXAMEN_2_QUESTIONS } from '@/data/exams/questions/examen2';
import { EXAMEN_3_QUESTIONS } from '@/data/exams/questions/examen3';
import { EXAMEN_4_QUESTIONS } from '@/data/exams/questions/examen4';

export type ExamAreaId =
  | 'espanol'
  | 'matematicas'
  | 'informatica'
  | 'online'
  | 'especifica'
  | 'sociales'
  | 'experimentales';

export interface ExamAreaInfo {
  id: ExamAreaId;
  label: string;
  aliases?: string[];
  icon: LucideIcon;
  gradient: string;
}

export interface ExamCoverage {
  espanol: number;
  matematicas: number;
  informatica: number;
  online: number;
  especifica: number;
  sociales: number;
  experimentales: number;
}

export interface ExamMeta {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
  difficulty: Difficulty;
  coverage: ExamCoverage;
  recommended?: boolean;
}

export interface ExamCoverageItem {
  area: ExamAreaInfo;
  count: number;
  percentage: number;
}

export const EXAM_AREAS: ExamAreaInfo[] = [
  {
    id: 'espanol',
    label: 'Español',
    aliases: ['Redacción y Comprensión Lectora', 'ESPAÑOL Y COMPRENSIÓN LECTORA'],
    icon: BookOpen,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'matematicas',
    label: 'Matemáticas',
    aliases: [
      'Pensamiento Matemático',
      'Razonamiento Lógico-Matemático',
      'MATEMÁTICAS Y RAZONAMIENTO LÓGICO',
    ],
    icon: Calculator,
    gradient: 'from-emerald to-teal-600',
  },
  {
    id: 'informatica',
    label: 'Informática',
    aliases: ['Habilidades Digitales', 'Uso de Tecnologías de la Información', 'INFORMÁTICA'],
    icon: Laptop,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'online',
    label: 'Ambientes Virtuales',
    aliases: ['HABILIDADES PARA EL APRENDIZAJE EN LÍNEA'],
    icon: Globe,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'especifica',
    label: 'Lógica de Programación',
    icon: Code2,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'sociales',
    label: 'Ciencias Sociales',
    aliases: ['HISTORIA Y CIVISMO (Ciencias Sociales y Administrativas)'],
    icon: Landmark,
    gradient: 'from-rose-500 to-red-600',
  },
  {
    id: 'experimentales',
    label: 'Ciencias Experimentales',
    aliases: [
      'CIENCIAS DE LA SALUD, BIOLÓGICAS Y AMBIENTALES (Química/Biología/Ecología)',
      'FÍSICA (Ciencias Exactas e Ingeniería)',
    ],
    icon: FlaskConical,
    gradient: 'from-lime-500 to-green-600',
  },
];

export const EXAM_META: ExamMeta[] = [
  {
    id: 'examen-1',
    title: 'Examen 1 · Simulador de Admisión UnADM',
    description:
      'Simulacro completo de 100 reactivos bajo los estándares Ceneval y UnADM: Comprensión Lectora, Pensamiento Matemático, Tecnologías de la Información, Ambientes Virtuales y Lógica de Programación.',
    durationMinutes: 120,
    questionCount: 100,
    difficulty: 'dificil',
    coverage: {
      espanol: 25,
      matematicas: 30,
      informatica: 20,
      online: 10,
      especifica: 15,
      sociales: 0,
      experimentales: 0,
    },
    recommended: true,
  },
  {
    id: 'examen-2',
    title: 'Examen 2 · Simulador de Admisión UnADM',
    description:
      'Segundo simulacro completo de 100 reactivos de dificultad básica-media: Español, Pensamiento Matemático, Habilidades Digitales, Ciencias Sociales y Ciencias Experimentales.',
    durationMinutes: 120,
    questionCount: 100,
    difficulty: 'media',
    coverage: {
      espanol: 20,
      matematicas: 20,
      informatica: 20,
      online: 0,
      especifica: 0,
      sociales: 20,
      experimentales: 20,
    },
  },
  {
    id: 'examen-3',
    title: 'Examen 3 · Simulador de Admisión UnADM',
    description:
      'Tercer simulacro con 100 reactivos tipo CUH UnADM: Redacción y Comprensión Lectora, Razonamiento Lógico-Matemático y Uso de Tecnologías de la Información.',
    durationMinutes: 120,
    questionCount: 100,
    difficulty: 'media',
    coverage: {
      espanol: 33,
      matematicas: 34,
      informatica: 33,
      online: 0,
      especifica: 0,
      sociales: 0,
      experimentales: 0,
    },
  },
  {
    id: 'examen-4',
    title: 'Examen 4 · Simulador de Admisión UnADM',
    description:
      'Examen Final de práctica con 108 reactivos tipo CUH UnADM que cubren las 7 áreas del temario: Español y Comprensión Lectora, Matemáticas y Razonamiento Lógico, Informática, Ciencias de la Salud, Física, Historia y Civismo, y Habilidades para el Aprendizaje en Línea.',
    durationMinutes: 270,
    questionCount: 108,
    difficulty: 'dificil',
    coverage: {
      espanol: 28,
      matematicas: 28,
      informatica: 20,
      online: 2,
      especifica: 0,
      sociales: 10,
      experimentales: 20,
    },
  },
];

export const EXAM_DIFFICULTY: Record<Difficulty, { label: string; className: string }> = {
  facil: {
    label: 'Fácil',
    className: 'bg-emerald/10 text-emerald ring-emerald/20',
  },
  media: {
    label: 'Media',
    className: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
  },
  dificil: {
    label: 'Difícil',
    className: 'bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400',
  },
};

export function getExamMeta(examId: string): ExamMeta | undefined {
  return EXAM_META.find((exam) => exam.id === examId);
}

export function getExamAreaByLabel(label: string): ExamAreaInfo | undefined {
  return EXAM_AREAS.find(
    (area) => area.label === label || area.aliases?.includes(label) === true,
  );
}

export const AREA_STUDY_TOPICS: Record<ExamAreaId, string[]> = {
  espanol: ['Comprensión lectora', 'Gramática y ortografía', 'Conectores textuales'],
  matematicas: ['Álgebra', 'Aritmética', 'Razonamiento matemático', 'Probabilidad y estadística'],
  informatica: ['Tecnologías de la información', 'Ofimática', 'Seguridad digital'],
  online: ['Ambientes virtuales de aprendizaje', 'Herramientas digitales UnADM'],
  especifica: ['Lógica de programación', 'Diagramas de flujo', 'Algoritmos'],
  sociales: ['Historia', 'Geografía', 'Civismo y sociedad'],
  experimentales: ['Biología', 'Física', 'Química'],
};

export function getAreaStudyTopics(areaId: ExamAreaId): string[] {
  return AREA_STUDY_TOPICS[areaId];
}

const EXAM_QUESTION_BANK: Record<string, ExamQuestion[]> = {
  'examen-2': EXAMEN_2_QUESTIONS,
  'examen-3': EXAMEN_3_QUESTIONS,
  'examen-4': EXAMEN_4_QUESTIONS,
};

export function getExamQuestions(examId: string): ExamQuestion[] {
  return EXAM_QUESTION_BANK[examId] ?? [];
}

export function getExamCoverageList(exam: ExamMeta): ExamCoverageItem[] {
  return EXAM_AREAS.map((area) => {
    const count = exam.coverage[area.id];
    const percentage =
      exam.questionCount === 0 ? 0 : Math.round((count / exam.questionCount) * 100);
    return { area, count, percentage };
  }).filter((item) => item.count > 0);
}

export function formatExamDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours > 0 && remainder > 0) {
    return `${hours} h ${remainder} min`;
  }
  if (hours > 0) {
    return `${hours} h`;
  }
  return `${minutes} min`;
}
