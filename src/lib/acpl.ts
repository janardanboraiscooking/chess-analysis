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
