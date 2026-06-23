import { MoveClassification } from '@/types';

function winningChances(cp: number): number {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

export function classifyMove(
  evalBefore: number,
  evalAfter: number,
  isBlackMove: boolean,
  playerMove?: string,
  bestMove?: string,
  pv?: string[]
): MoveClassification {
  // If player played the engine's best move, it's best
  if (playerMove && bestMove) {
    const pm = playerMove.trim().toLowerCase();
    const bm = bestMove.trim().toLowerCase();
    if (pm === bm) return 'best';
  }
  // Also check PV first move
  if (playerMove && pv && pv.length > 0) {
    const pm = playerMove.trim().toLowerCase();
    const pvFirst = pv[0].trim().toLowerCase();
    if (pm === pvFirst) return 'best';
  }

  const povBefore = isBlackMove ? -evalBefore : evalBefore;
  const povAfter = isBlackMove ? -evalAfter : evalAfter;

  const winBefore = winningChances(povBefore);
  const winAfter = winningChances(povAfter);
  const delta = winBefore - winAfter;

  if (delta >= 25) return 'blunder';
  if (delta >= 15) return 'mistake';
  if (delta >= 8) return 'inaccuracy';
  if (delta >= 3) return 'good';
  return 'excellent';
}
