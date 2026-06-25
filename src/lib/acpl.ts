interface EvalLossEntry {
  evalLoss: number;
  isBlack: boolean;
}

export function calculateACPL(moves: EvalLossEntry[], isBlack: boolean): number {
  const sideMoves = moves.filter(m => m.isBlack === isBlack);
  if (sideMoves.length === 0) return 0;
  const total = sideMoves.reduce((sum, m) => sum + m.evalLoss, 0);
  return Math.round(total / sideMoves.length);
}

// Chess.com-style accuracy: weighted by move classification
// This works at any engine depth since it doesn't depend on eval delta magnitude
export function calculateAccuracy(
  moves: { classification?: string; isBlack: boolean }[],
  isBlack: boolean
): number {
  const sideMoves = moves.filter(m => m.isBlack === isBlack);
  if (sideMoves.length === 0) return 0;

  const weights: Record<string, number> = {
    best: 100,
    excellent: 95,
    good: 80,
    inaccuracy: 60,
    mistake: 30,
    blunder: 0,
  };

  const total = sideMoves.reduce((sum, m) => sum + (weights[m.classification || ''] ?? 50), 0);
  return total / sideMoves.length / 100;
}
