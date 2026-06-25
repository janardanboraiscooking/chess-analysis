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

// Per-move accuracy from centipawn loss (scaled ×10 to match chess.com calibration)
// 0cp=100%, 5cp=97.6%, 10cp=91.2%, 20cp=72%, 50cp=29%
export function moveAccuracy(evalLossCp: number): number {
  const scaled = evalLossCp * 10;
  return 103168 / (103168 + scaled * scaled);
}

// Game accuracy = average of per-move accuracies
export function calculateAccuracy(moves: EvalLossEntry[], isBlack: boolean): number {
  const sideMoves = moves.filter(m => m.isBlack === isBlack);
  if (sideMoves.length === 0) return 0;
  const totalAcc = sideMoves.reduce((sum, m) => sum + moveAccuracy(m.evalLoss), 0);
  return totalAcc / sideMoves.length;
}
