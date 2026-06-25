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

// Chess.com-style accuracy based on win% delta, not raw centipawn loss
// accuracy = 103168 / (103168 + winDelta^2)
function winningChances(cp: number): number {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

export function moveAccuracy(evalBefore: number, evalAfter: number, isBlack: boolean): number {
  const povBefore = isBlack ? -evalBefore : evalBefore;
  const povAfter = isBlack ? -evalAfter : evalAfter;
  const winBefore = winningChances(povBefore);
  const winAfter = winningChances(povAfter);
  const winDelta = Math.max(0, winBefore - winAfter);
  // accuracy from win% delta: 0 delta → 100%, 5 delta → ~80%, 10 delta → ~50%
  return 103168 / (103168 + winDelta * winDelta);
}

// Calculate game accuracy for one side
export function calculateAccuracy(moves: { evalBefore: number; evalAfter: number; isBlack: boolean }[], isBlack: boolean): number {
  const sideMoves = moves.filter(m => m.isBlack === isBlack);
  if (sideMoves.length === 0) return 0;
  const totalAcc = sideMoves.reduce((sum, m) => sum + moveAccuracy(m.evalBefore, m.evalAfter, m.isBlack), 0);
  return totalAcc / sideMoves.length;
}
