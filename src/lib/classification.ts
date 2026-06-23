import { MoveClassification } from '@/types';

function winningChances(cp: number): number {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

export function classifyMove(
  evalBefore: number,
  evalAfter: number,
  isBlackMove: boolean
): MoveClassification {
  const povBefore = isBlackMove ? -evalBefore : evalBefore;
  const povAfter = isBlackMove ? -evalAfter : evalAfter;

  const winBefore = winningChances(povBefore);
  const winAfter = winningChances(povAfter);
  const delta = winBefore - winAfter;

  // Thresholds tuned for depth 12
  if (delta >= 25) return 'blunder';
  if (delta >= 15) return 'mistake';
  if (delta >= 8) return 'inaccuracy';
  if (delta >= 3) return 'good';
  return 'excellent';
}
