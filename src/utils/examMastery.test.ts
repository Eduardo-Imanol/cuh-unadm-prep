import { describe, expect, it } from 'vitest';
import { getExamMeta } from '@/data/exams';
import { getSyllabusLeavesByArea } from '@/data/syllabus';
import { computeExamMastery } from '@/utils/examMastery';

function idsOf(area: string): Set<string> {
  return new Set(getSyllabusLeavesByArea(area as never).map((leaf) => leaf.id));
}

describe('computeExamMastery', () => {
  it('returns undefined when nothing is mastered', () => {
    const exam = getExamMeta('examen-1');
    expect(exam).toBeDefined();
    if (exam === undefined) {
      throw new Error('examen-1 must exist');
    }
    expect(computeExamMastery(exam, new Set())).toBeUndefined();
  });

  it('weights mastery by the exam coverage per area', () => {
    const exam = getExamMeta('examen-1');
    expect(exam).toBeDefined();
    if (exam === undefined) {
      throw new Error('examen-1 must exist');
    }

    const espanolOnly = idsOf('espanol');
    expect(computeExamMastery(exam, espanolOnly)).toBe(29);

    const espanolAndMath = new Set([...espanolOnly, ...idsOf('matematicas')]);
    expect(computeExamMastery(exam, espanolAndMath)).toBe(65);
  });

  it('includes every area that has syllabus topics in the weight', () => {
    const exam = getExamMeta('examen-1');
    expect(exam).toBeDefined();
    if (exam === undefined) {
      throw new Error('examen-1 must exist');
    }

    const totalWeight =
      exam.coverage.espanol +
      exam.coverage.matematicas +
      exam.coverage.informatica +
      exam.coverage.online;
    expect(totalWeight).toBe(85);

    const allEspanol = idsOf('espanol');
    expect(computeExamMastery(exam, allEspanol)).toBe(Math.round((25 / totalWeight) * 100));
  });

  it('returns 100% when every covered area is fully mastered', () => {
    const exam = getExamMeta('examen-3');
    expect(exam).toBeDefined();
    if (exam === undefined) {
      throw new Error('examen-3 must exist');
    }

    const covered = new Set<string>();
    for (const area of ['espanol', 'matematicas', 'informatica'] as const) {
      for (const id of idsOf(area)) {
        covered.add(id);
      }
    }
    expect(computeExamMastery(exam, covered)).toBe(100);
  });
});
