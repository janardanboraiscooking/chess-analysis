import { MoveClassification } from '@/types';

function winningChances(cp: number): number {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

export function classifyMove(
  evalBefore: number,
  evalAfter: number,
  isBlackMove: boolean,
  playerMove?: string,
  bestMove?: string
): MoveClassification {
  // If player played the engine's top choice, it's best
  if (playerMove && bestMove && playerMove === bestMove) {
    return 'best';
  }

  // Eval is always from white's perspective
  // For black: negate to get black's perspective
  const povBefore = isBlackMove ? -evalBefore : evalBefore;
  const povAfter = isBlackMove ? -evalAfter : evalAfter;

  const winBefore = winningChances(povBefore);
  const winAfter = winningChances(povAfter);
  const delta = winBefore - winAfter;

  // Lenient thresholds for depth 10 (evals are noisy)
  if (delta >= 35) return 'blunder';
  if (delta >= 25) return 'mistake';
  if (delta >= 15) return 'inaccuracy';
  if (delta >= 5) return 'good';
  return 'excellent';
}
