import { classifyMove } from '@/lib/classification';

describe('classifyMove', () => {
  it('classifies best move (eval loss <= 10)', () => {
    expect(classifyMove(100, 95, false)).toBe('best');
  });

  it('classifies excellent move (eval loss <= 30)', () => {
    expect(classifyMove(100, 75, false)).toBe('excellent');
  });

  it('classifies good move (eval loss <= 50)', () => {
    expect(classifyMove(100, 55, false)).toBe('good');
  });

  it('classifies inaccuracy (eval loss <= 100)', () => {
    expect(classifyMove(100, 10, false)).toBe('inaccuracy');
  });

  it('classifies mistake (eval loss <= 200)', () => {
    expect(classifyMove(100, -50, false)).toBe('mistake');
  });

  it('classifies blunder (eval loss > 200)', () => {
    expect(classifyMove(100, -150, false)).toBe('blunder');
  });

  it('handles black improving (eval worse for white = good for black)', () => {
    // eval -100→-200: white position got worse, so black played well
    expect(classifyMove(-100, -200, true)).toBe('best');
  });

  it('handles black blundering (eval better for white = bad for black)', () => {
    // eval -100→300: white position improved massively, so black blundered
    expect(classifyMove(-100, 300, true)).toBe('blunder');
  });
});
