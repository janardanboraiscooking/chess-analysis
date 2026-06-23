import { classifyMove } from '@/lib/classification';

describe('classifyMove', () => {
  it('best when player matches engine best move', () => {
    expect(classifyMove(100, -500, false, 'e2e4', 'e2e4')).toBe('best');
  });

  it('excellent (tiny eval loss)', () => {
    // win% drop < 3%
    expect(classifyMove(100, 80, false, 'd2d4', 'e2e4')).toBe('excellent');
  });

  it('good (small eval loss)', () => {
    // win% drop 3-10%
    expect(classifyMove(100, 0, false, 'd2d4', 'e2e4')).toBe('good');
  });

  it('inaccuracy (moderate eval loss)', () => {
    // win% drop 10-20%
    expect(classifyMove(200, -100, false, 'd2d4', 'e2e4')).toBe('inaccuracy');
  });

  it('mistake (large eval loss)', () => {
    // win% drop 20-30%
    expect(classifyMove(300, -300, false, 'd2d4', 'e2e4')).toBe('mistake');
  });

  it('blunder (huge eval loss)', () => {
    // win% drop > 30%
    expect(classifyMove(500, -500, false, 'd2d4', 'e2e4')).toBe('blunder');
  });

  it('handles black moves correctly', () => {
    // Black played best move
    expect(classifyMove(-100, 300, true, 'e7e5', 'e7e5')).toBe('best');
  });

  it('handles missing bestMove', () => {
    expect(classifyMove(100, 80, false, 'e2e4', '')).toBe('excellent');
    expect(classifyMove(500, -500, false, 'd2d4', '')).toBe('blunder');
  });
});
