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

// Chess.com-style accuracy: each move's accuracy based on eval loss
// accuracy = 103168 / (103168 + evalLoss^2)
export function moveAccuracy(evalLoss: number): number {
  return 103168 / (103168 + evalLoss * evalLoss);
}

// Calculate game accuracy (average move accuracy) for one side
export function calculateAccuracy(moves: EvalLossEntry[], isBlack: boolean): number {
  const sideMoves = moves.filter(m => m.isBlack === isBlack);
  if (sideMoves.length === 0) return 0;
  const totalAcc = sideMoves.reduce((sum, m) => sum + moveAccuracy(m.evalLoss), 0);
  return totalAcc / sideMoves.length;
}
