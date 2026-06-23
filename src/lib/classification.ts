import { MoveClassification } from '@/types';

export function classifyMove(
  evalBefore: number,
  evalAfter: number,
  isBlackMove: boolean
): MoveClassification {
  // eval is always from white's perspective
  // For black: negate both so evalLoss = how much black lost
  const eb = isBlackMove ? -evalBefore : evalBefore;
  const ea = isBlackMove ? -evalAfter : evalAfter;
  const evalLoss = eb - ea;

  if (evalLoss <= 10) return 'best';
  if (evalLoss <= 30) return 'excellent';
  if (evalLoss <= 50) return 'good';
  if (evalLoss <= 100) return 'inaccuracy';
  if (evalLoss <= 200) return 'mistake';
  return 'blunder';
}
