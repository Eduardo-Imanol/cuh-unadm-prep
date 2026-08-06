import type { ExamAreaId, ExamMeta } from '@/data/exams';
import { getSyllabusLeavesByArea } from '@/data/syllabus';

const COVERAGE_AREAS: ExamAreaId[] = [
  'espanol',
  'matematicas',
  'informatica',
  'online',
  'especifica',
  'sociales',
  'experimentales',
];

export function computeExamMastery(
  exam: ExamMeta,
  masteredIds: Set<string>,
): number | undefined {
  if (masteredIds.size === 0) {
    return undefined;
  }

  let totalWeight = 0;
  let masteredWeight = 0;

  for (const areaId of COVERAGE_AREAS) {
    const count = exam.coverage[areaId];
    if (count <= 0) {
      continue;
    }
    const leaves = getSyllabusLeavesByArea(areaId);
    if (leaves.length === 0) {
      continue;
    }
    const mastered = leaves.filter((leaf) => masteredIds.has(leaf.id)).length;
    totalWeight += count;
    masteredWeight += (mastered / leaves.length) * count;
  }

  if (totalWeight === 0) {
    return undefined;
  }
  return Math.round((masteredWeight / totalWeight) * 100);
}
