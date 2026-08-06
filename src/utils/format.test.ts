import { describe, expect, it } from 'vitest';
import { formatClock } from '@/utils/format';

describe('formatClock', () => {
  it('formats under an hour as mm:ss', () => {
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(59)).toBe('00:59');
    expect(formatClock(125)).toBe('02:05');
  });

  it('formats an hour or more as h:mm:ss', () => {
    expect(formatClock(3600)).toBe('1:00:00');
    expect(formatClock(7200)).toBe('2:00:00');
    expect(formatClock(4505)).toBe('1:15:05');
  });

  it('clamps negative values to zero', () => {
    expect(formatClock(-42)).toBe('00:00');
  });
});
