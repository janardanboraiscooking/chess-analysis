import { classifyMove } from '@/lib/classification';

describe('classifyMove', () => {
  it('classifies as best when player matches engine best move', () => {
    expect(classifyMove(100, -500, false, 'e2e4', 'e2e4')).toBe('best');
  });

  it('classifies as excellent (small eval loss)', () => {
    expect(classifyMove(100, 60, false, 'd2d4', 'e2e4')).toBe('excellent');
  });

  it('classifies as good (moderate eval loss)', () => {
    expect(classifyMove(100, -80, false, 'd2d4', 'e2e4')).toBe('good');
  });

  it('classifies as inaccuracy', () => {
    expect(classifyMove(100, -350, false, 'd2d4', 'e2e4')).toBe('inaccuracy');
  });

  it('classifies as mistake', () => {
    expect(classifyMove(100, -700, false, 'd2d4', 'e2e4')).toBe('mistake');
  });

  it('classifies as blunder (large eval loss)', () => {
    expect(classifyMove(100, -1200, false, 'd2d4', 'e2e4')).toBe('blunder');
  });

  it('handles black moves correctly', () => {
    // Black played best move
    expect(classifyMove(-100, 300, true, 'e7e5', 'e7e5')).toBe('best');
    // Black blundered (not best move)
    expect(classifyMove(-100, 1100, true, 'a7a6', 'e7e5')).toBe('blunder');
  });

  it('handles missing bestMove (use eval only)', () => {
    expect(classifyMove(100, 80, false, 'e2e4', '')).toBe('excellent');
    expect(classifyMove(100, -1200, false, 'd2d4', '')).toBe('blunder');
  });
});
