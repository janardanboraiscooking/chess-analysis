import { MoveClassification } from '@/types';

/**
 * Classify a move.
 * If the player played the engine's best move → "best" (regardless of eval swing).
 * Otherwise, classify by eval loss with thresholds tuned for depth 10.
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

  // eval is always from white's perspective
  // For black: negate both so evalLoss = how much that side lost
  const eb = isBlackMove ? -evalBefore : evalBefore;
  const ea = isBlackMove ? -evalAfter : evalAfter;
  const evalLoss = eb - ea;

  // Very wide thresholds for depth 10 — evals swing 500-800cp in tactics
  // Only flag truly terrible moves as blunders (>2 pawns lost)
  if (evalLoss <= 200) return 'excellent';
  if (evalLoss <= 500) return 'good';
  if (evalLoss <= 1000) return 'inaccuracy';
  if (evalLoss <= 2000) return 'mistake';
  return 'blunder';
}
