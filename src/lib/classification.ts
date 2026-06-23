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

  // Wide thresholds for depth 10 (evals are noisy in tactical positions)
  if (evalLoss <= 50) return 'excellent';
  if (evalLoss <= 200) return 'good';
  if (evalLoss <= 500) return 'inaccuracy';
  if (evalLoss <= 1000) return 'mistake';
  return 'blunder';
}
