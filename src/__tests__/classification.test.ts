import { classifyMove } from '@/lib/classification';

describe('classifyMove', () => {
  it('classifies best move (eval loss <= 30)', () => {
    expect(classifyMove(100, 80, false)).toBe('best');
  });

  it('classifies excellent move (eval loss <= 100)', () => {
    expect(classifyMove(100, 20, false)).toBe('excellent');
  });

  it('classifies good move (eval loss <= 200)', () => {
    expect(classifyMove(100, -80, false)).toBe('good');
  });

  it('classifies inaccuracy (eval loss <= 400)', () => {
    expect(classifyMove(100, -280, false)).toBe('inaccuracy');
  });

  it('classifies mistake (eval loss <= 800)', () => {
    expect(classifyMove(100, -680, false)).toBe('mistake');
  });

  it('classifies blunder (eval loss > 800)', () => {
    expect(classifyMove(100, -900, false)).toBe('blunder');
  });

  it('handles black improving (eval worse for white = good for black)', () => {
    expect(classifyMove(-100, -300, true)).toBe('best');
  });

  it('handles black blundering (eval better for white = bad for black)', () => {
    expect(classifyMove(-100, 900, true)).toBe('blunder');
  });
});
