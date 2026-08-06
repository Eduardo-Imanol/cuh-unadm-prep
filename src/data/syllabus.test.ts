import { describe, expect, it } from 'vitest';
import {
  SYLLABUS_GUIDE,
  SYLLABUS_REVIEW_PLAN,
  SYLLABUS_SECTIONS,
  getSyllabusAreaGroups,
  getSyllabusCountByArea,
  getSyllabusLeaves,
  getSyllabusLeavesByArea,
  getSyllabusTotalCount,
} from '@/data/syllabus';

describe('CUH syllabus data', () => {
  it('defines the full temario with unique leaf ids', () => {
    const leaves = getSyllabusLeaves();
    const ids = new Set(leaves.map((leaf) => leaf.id));
    expect(ids.size).toBe(leaves.length);
  });

  it('counts 118 subtemas distributed across areas', () => {
    expect(getSyllabusTotalCount()).toBe(118);

    const counts = getSyllabusCountByArea();
    expect(counts.espanol).toBe(35);
    expect(counts.matematicas).toBe(31);
    expect(counts.informatica).toBe(26);
    expect(counts.experimentales).toBe(13);
    expect(counts.sociales).toBe(3);
    expect(counts.online).toBe(10);
    expect(counts.especifica).toBe(0);
  });

  it('groups sections by area preserving first appearance order', () => {
    const groups = getSyllabusAreaGroups();
    expect(groups.map((group) => group.area)).toEqual([
      'espanol',
      'matematicas',
      'informatica',
      'experimentales',
      'sociales',
      'online',
    ]);
    expect(groups.find((group) => group.area === 'experimentales')?.sections).toHaveLength(2);
  });

  it('leaves per area match the section topics', () => {
    const total = SYLLABUS_SECTIONS.reduce(
      (acc, section) =>
        acc + section.topics.reduce((sum, topic) => sum + topic.items.length, 0),
      0,
    );
    expect(total).toBe(118);
    expect(getSyllabusLeavesByArea('espanol')).toHaveLength(35);
  });

  it('includes the strategy guide and the 8-week review plan', () => {
    expect(SYLLABUS_GUIDE).toHaveLength(4);
    expect(SYLLABUS_REVIEW_PLAN).toHaveLength(8);
    expect(SYLLABUS_REVIEW_PLAN[0]?.week).toBe(1);
  });
});
