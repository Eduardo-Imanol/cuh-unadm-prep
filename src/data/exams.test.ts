import { describe, expect, it } from 'vitest';
import {
  EXAM_META,
  formatExamDuration,
  getExamAreaByLabel,
  getExamCoverageList,
  getExamMeta,
  getExamQuestions,
} from '@/data/exams';

describe('catalog of CUH exams', () => {
  it('exposes exactly 4 complete exams', () => {
    expect(EXAM_META).toHaveLength(4);
  });

  it('has unique exam ids', () => {
    const ids = EXAM_META.map((exam) => exam.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps coverage consistent with question count and positive durations', () => {
    for (const exam of EXAM_META) {
      const covered =
        exam.coverage.espanol +
        exam.coverage.matematicas +
        exam.coverage.informatica +
        exam.coverage.online +
        exam.coverage.especifica +
        exam.coverage.sociales +
        exam.coverage.experimentales;
      expect(covered).toBe(exam.questionCount);
      expect(exam.durationMinutes).toBeGreaterThan(0);
      expect(exam.questionCount).toBeGreaterThan(0);
    }
  });

  it('marks the admission exam as recommended and first', () => {
    expect(EXAM_META[0]?.id).toBe('examen-1');
    expect(EXAM_META[0]?.recommended).toBe(true);
  });

  it('returns undefined for unknown exams', () => {
    expect(getExamMeta('examen-inexistente')).toBeUndefined();
  });

  it('builds a coverage list that stays near 100% after rounding', () => {
    const finalExam = EXAM_META.find((exam) => exam.id === 'examen-4');
    expect(finalExam).toBeDefined();
    if (finalExam === undefined) {
      throw new Error('examen-4 must exist in the catalog');
    }
    const coverage = getExamCoverageList(finalExam);
    expect(coverage).toHaveLength(6);
    for (const item of coverage) {
      expect(item.percentage).toBeGreaterThan(0);
      expect(item.percentage).toBeLessThanOrEqual(100);
    }
    const total = coverage.reduce((acc, item) => acc + item.percentage, 0);
    expect(total).toBeGreaterThanOrEqual(98);
    expect(total).toBeLessThanOrEqual(102);
  });

  it('formats durations in Spanish', () => {
    expect(formatExamDuration(40)).toBe('40 min');
    expect(formatExamDuration(60)).toBe('1 h');
    expect(formatExamDuration(75)).toBe('1 h 15 min');
  });
});

describe('Examen 1 maintenance state', () => {
  it('keeps the exam in the catalog while in maintenance', () => {
    expect(getExamMeta('examen-1')).toBeDefined();
  });

  it('returns an empty bank while the exam is in maintenance', () => {
    expect(getExamQuestions('examen-1')).toHaveLength(0);
  });

  it('returns an empty bank for unknown exams', () => {
    expect(getExamQuestions('examen-inexistente')).toHaveLength(0);
  });
});

describe('Examen 2 question bank', () => {
  it('contains exactly 100 unique, well-formed reactivos', () => {
    const questions = getExamQuestions('examen-2');
    expect(questions).toHaveLength(100);

    const ids = new Set(questions.map((question) => question.id));
    expect(ids.size).toBe(100);

    const texts = new Set(questions.map((question) => question.text));
    expect(texts.size).toBe(100);

    for (const question of questions) {
      expect(question.options.length).toBe(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.feedback).toBeTypeOf('string');
    }
  });

  it('distributes 20 reactivos per area matching the catalog coverage', () => {
    const exam = getExamMeta('examen-2');
    expect(exam).toBeDefined();
    if (exam === undefined) {
      throw new Error('examen-2 must exist in the catalog');
    }

    const questions = getExamQuestions(exam.id);
    const counts = questions.reduce<Record<string, number>>((acc, question) => {
      acc[question.category] = (acc[question.category] ?? 0) + 1;
      return acc;
    }, {});

    expect(counts['Español']).toBe(20);
    expect(counts['Pensamiento Matemático']).toBe(20);
    expect(counts['Habilidades Digitales']).toBe(20);
    expect(counts['Ciencias Sociales']).toBe(20);
    expect(counts['Ciencias Experimentales']).toBe(20);

    expect(counts['Español']).toBe(exam.coverage.espanol);
    expect(counts['Pensamiento Matemático']).toBe(exam.coverage.matematicas);
    expect(counts['Habilidades Digitales']).toBe(exam.coverage.informatica);
    expect(counts['Ciencias Sociales']).toBe(exam.coverage.sociales);
    expect(counts['Ciencias Experimentales']).toBe(exam.coverage.experimentales);
    expect(exam.questionCount).toBe(questions.length);
  });
});

describe('Examen 3 question bank', () => {
  it('contains exactly 100 unique, well-formed reactivos', () => {
    const questions = getExamQuestions('examen-3');
    expect(questions).toHaveLength(100);

    const ids = new Set(questions.map((question) => question.id));
    expect(ids.size).toBe(100);

    const texts = new Set(questions.map((question) => question.text));
    expect(texts.size).toBe(100);

    for (const question of questions) {
      expect(question.options.length).toBe(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.feedback).toBeTypeOf('string');
    }
  });

  it('distributes reactivos per area matching the catalog coverage', () => {
    const exam = getExamMeta('examen-3');
    expect(exam).toBeDefined();
    if (exam === undefined) {
      throw new Error('examen-3 must exist in the catalog');
    }

    const questions = getExamQuestions(exam.id);
    const counts = questions.reduce<Record<string, number>>((acc, question) => {
      acc[question.category] = (acc[question.category] ?? 0) + 1;
      return acc;
    }, {});

    expect(counts['Redacción y Comprensión Lectora']).toBe(exam.coverage.espanol);
    expect(counts['Razonamiento Lógico-Matemático']).toBe(exam.coverage.matematicas);
    expect(counts['Uso de Tecnologías de la Información']).toBe(exam.coverage.informatica);
    expect(exam.questionCount).toBe(questions.length);
  });
});

describe('Examen 4 question bank', () => {
  it('contains exactly 108 unique, well-formed reactivos', () => {
    const questions = getExamQuestions('examen-4');
    expect(questions).toHaveLength(108);

    const ids = new Set(questions.map((question) => question.id));
    expect(ids.size).toBe(108);

    const texts = new Set(questions.map((question) => question.text));
    expect(texts.size).toBe(108);

    for (const question of questions) {
      expect(question.options.length).toBe(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
      expect(question.feedback).toBeTypeOf('string');
    }
  });

  it('distributes reactivos per area matching the catalog coverage', () => {
    const exam = getExamMeta('examen-4');
    expect(exam).toBeDefined();
    if (exam === undefined) {
      throw new Error('examen-4 must exist in the catalog');
    }

    const questions = getExamQuestions(exam.id);
    const counts = questions.reduce<Record<string, number>>((acc, question) => {
      acc[question.category] = (acc[question.category] ?? 0) + 1;
      return acc;
    }, {});

    expect(counts['ESPAÑOL Y COMPRENSIÓN LECTORA']).toBe(exam.coverage.espanol);
    expect(counts['MATEMÁTICAS Y RAZONAMIENTO LÓGICO']).toBe(exam.coverage.matematicas);
    expect(counts['INFORMÁTICA']).toBe(exam.coverage.informatica);
    expect(counts['HABILIDADES PARA EL APRENDIZAJE EN LÍNEA']).toBe(exam.coverage.online);
    expect(counts['CIENCIAS DE LA SALUD, BIOLÓGICAS Y AMBIENTALES (Química/Biología/Ecología)']).toBe(10);
    expect(counts['FÍSICA (Ciencias Exactas e Ingeniería)']).toBe(10);
    expect(counts['HISTORIA Y CIVISMO (Ciencias Sociales y Administrativas)']).toBe(10);
    expect(exam.coverage.sociales).toBe(10);
    expect(exam.coverage.experimentales).toBe(20);
    expect(exam.questionCount).toBe(questions.length);
  });
});

describe('area resolution', () => {
  it('resolves exam labels and aliases to areas', () => {
    expect(getExamAreaByLabel('Español')?.id).toBe('espanol');
    expect(getExamAreaByLabel('Redacción y Comprensión Lectora')?.id).toBe('espanol');
    expect(getExamAreaByLabel('Pensamiento Matemático')?.id).toBe('matematicas');
    expect(getExamAreaByLabel('Razonamiento Lógico-Matemático')?.id).toBe('matematicas');
    expect(getExamAreaByLabel('Habilidades Digitales')?.id).toBe('informatica');
    expect(getExamAreaByLabel('Uso de Tecnologías de la Información')?.id).toBe('informatica');
    expect(getExamAreaByLabel('Ciencias Sociales')?.id).toBe('sociales');
    expect(getExamAreaByLabel('Ciencias Experimentales')?.id).toBe('experimentales');
    expect(getExamAreaByLabel('Ambientes Virtuales')?.id).toBe('online');
    expect(getExamAreaByLabel('Lógica de Programación')?.id).toBe('especifica');
    expect(getExamAreaByLabel('ESPAÑOL Y COMPRENSIÓN LECTORA')?.id).toBe('espanol');
    expect(getExamAreaByLabel('MATEMÁTICAS Y RAZONAMIENTO LÓGICO')?.id).toBe('matematicas');
    expect(getExamAreaByLabel('INFORMÁTICA')?.id).toBe('informatica');
    expect(getExamAreaByLabel('HABILIDADES PARA EL APRENDIZAJE EN LÍNEA')?.id).toBe('online');
    expect(getExamAreaByLabel('HISTORIA Y CIVISMO (Ciencias Sociales y Administrativas)')?.id).toBe('sociales');
    expect(
      getExamAreaByLabel('CIENCIAS DE LA SALUD, BIOLÓGICAS Y AMBIENTALES (Química/Biología/Ecología)')?.id,
    ).toBe('experimentales');
    expect(getExamAreaByLabel('FÍSICA (Ciencias Exactas e Ingeniería)')?.id).toBe('experimentales');
    expect(getExamAreaByLabel('Inexistente')).toBeUndefined();
  });
});
