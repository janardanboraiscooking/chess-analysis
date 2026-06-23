'use client';
import { AnalyzedMove, MoveClassification } from '@/types';

interface Props { moves: AnalyzedMove[]; currentMoveIndex: number; onMoveClick: (i: number) => void; }

const bc: Record<MoveClassification, string> = { best: 'badge-best', excellent: 'badge-excellent', good: 'badge-good', inaccuracy: 'badge-inaccuracy', mistake: 'badge-mistake', blunder: 'badge-blunder' };
const sy: Record<MoveClassification, string> = { best: '!!', excellent: '!', good: '', inaccuracy: '?!', mistake: '?', blunder: '??' };

export default function MoveList({ moves, currentMoveIndex, onMoveClick }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-[var(--cream-dim)] font-[Playfair_Display]">Moves</h3>
      <div className="space-y-0.5">
        {moves.map((move, idx) => (
          <div key={idx} className="flex items-center gap-1 py-0.5">
            <span className="mono w-7 text-right text-xs text-[var(--cream-muted)]">{move.moveNumber}.</span>
            {move.white && (
              <button onClick={() => onMoveClick(idx * 2)} className={`move-btn ${currentMoveIndex === idx * 2 ? 'active' : ''}`}>
                {move.white.san}{sy[move.white.classification] && <span className={`ml-1 ${bc[move.white.classification]}`}>{sy[move.white.classification]}</span>}
              </button>
            )}
            {move.black && (
              <button onClick={() => onMoveClick(idx * 2 + 1)} className={`move-btn ${currentMoveIndex === idx * 2 + 1 ? 'active' : ''}`}>
                {move.black.san}{sy[move.black.classification] && <span className={`ml-1 ${bc[move.black.classification]}`}>{sy[move.black.classification]}</span>}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
