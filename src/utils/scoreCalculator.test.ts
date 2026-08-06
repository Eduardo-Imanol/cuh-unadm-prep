import { describe, expect, it } from 'vitest';
import { evaluateExam } from './scoreCalculator';
import type { ExamQuestion } from '@/types';

const questions: ExamQuestion[] = [
  { id: 'q1', text: '¿Capital de México?', options: ['CDMX', 'Guadalajara', 'Monterrey', 'Puebla'], correctIndex: 0, category: 'Geografia' },
  { id: 'q2', text: '¿2+2?', options: ['3', '4', '5', '6'], correctIndex: 1, category: 'Matematicas' },
  { id: 'q3', text: '¿H2O es?', options: ['Sal', 'Agua', 'Oxígeno', 'Aire'], correctIndex: 1, category: 'Ciencias' },
];

describe('evaluateExam', () => {
  it('calcula puntaje perfecto con todas las respuestas correctas', () => {
    const result = evaluateExam(questions, { q1: 0, q2: 1, q3: 1 });
    expect(result.score).toBe(3);
    expect(result.percentage).toBe(100);
    expect(result.unanswered).toBe(0);
    expect(result.incorrect).toBe(0);
  });

  it('cuenta incorrectas y sin responder', () => {
    const result = evaluateExam(questions, { q1: 2, q3: 1 });
    expect(result.score).toBe(1);
    expect(result.incorrect).toBe(1);
    expect(result.unanswered).toBe(1);
  });

  it('devuelve percentage 0 cuando no hay preguntas', () => {
    const result = evaluateExam([], {});
    expect(result.percentage).toBe(0);
    expect(result.score).toBe(0);
  });

  it('agrupa breakdown por categoría', () => {
    const result = evaluateExam(questions, { q1: 0, q2: 1, q3: 0 });
    const ciencias = result.breakdown.find((b) => b.category === 'Ciencias');
    expect(ciencias).toEqual({ category: 'Ciencias', correct: 0, total: 1 });
  });
});
