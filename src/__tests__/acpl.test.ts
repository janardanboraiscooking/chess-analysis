import { calculateACPL } from '@/lib/acpl';

describe('calculateACPL', () => {
  it('calculates ACPL for white', () => {
    const moves = [
      { evalLoss: 10, isBlack: false },
      { evalLoss: 30, isBlack: false },
      { evalLoss: 20, isBlack: false },
    ];
    expect(calculateACPL(moves, false)).toBe(20);
  });

  it('calculates ACPL for black', () => {
    const moves = [
      { evalLoss: 40, isBlack: true },
      { evalLoss: 60, isBlack: true },
    ];
    expect(calculateACPL(moves, true)).toBe(50);
  });

  it('returns 0 for no moves', () => {
    expect(calculateACPL([], false)).toBe(0);
  });

  it('ignores moves from the other side', () => {
    const moves = [
      { evalLoss: 10, isBlack: false },
      { evalLoss: 100, isBlack: true },
      { evalLoss: 20, isBlack: false },
    ];
    expect(calculateACPL(moves, false)).toBe(15);
  });
});
