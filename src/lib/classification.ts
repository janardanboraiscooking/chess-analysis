import { MoveClassification } from '@/types';

function winningChances(cp: number): number {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

export function classifyMove(
  evalBefore: number,
  evalAfter: number,
  isBlackMove: boolean
): MoveClassification {
  const povEvalBefore = isBlackMove ? -evalBefore : evalBefore;
  const povEvalAfter = isBlackMove ? -evalAfter : evalAfter;

  const winBefore = winningChances(povEvalBefore);
  const winAfter = winningChances(povEvalAfter);
  const delta = winBefore - winAfter;

  if (delta >= 30) return 'blunder';
  if (delta >= 20) return 'mistake';
  if (delta >= 10) return 'inaccuracy';
  if (delta >= 3) return 'good';
  return 'excellent';
}
