import { MoveClassification } from '@/types';

/**
 * Convert centipawns to winning chance (0-100%).
 * Lichess's exact sigmoid formula from WinPercent.scala.
 */
function winningChances(cp: number): number {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

/**
 * Classify a move using Lichess's exact algorithm.
 * Compares win% before vs after the move.
 * Thresholds: Inaccuracy=10%, Mistake=20%, Blunder=30% win chance drop.
 */
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

  // eval is from white's perspective
  // For black's move: invert so delta = how much black lost
  const povEvalBefore = isBlackMove ? -evalBefore : evalBefore;
  const povEvalAfter = isBlackMove ? -evalAfter : evalAfter;

  const winBefore = winningChances(povEvalBefore);
  const winAfter = winningChances(povEvalAfter);
  const delta = winBefore - winAfter; // positive = lost winning chances = bad move

  // Lichess exact thresholds (depth 20+)
  if (delta >= 30) return 'blunder';
  if (delta >= 20) return 'mistake';
  if (delta >= 10) return 'inaccuracy';
  if (delta >= 3) return 'good';
  return 'excellent';
}
