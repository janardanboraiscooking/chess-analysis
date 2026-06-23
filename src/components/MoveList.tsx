'use client';
import { AnalyzedMove, MoveClassification } from '@/types';

interface Props { moves: AnalyzedMove[]; currentMoveIndex: number; onMoveClick: (i: number) => void; }

const bc: Record<MoveClassification, string> = { best: 'badge-best', excellent: 'badge-excellent', good: 'badge-good', inaccuracy: 'badge-inaccuracy', mistake: 'badge-mistake', blunder: 'badge-blunder' };
const sy: Record<MoveClassification, string> = { best: '!!', excellent: '!', good: '', inaccuracy: '?!', mistake: '?', blunder: '??' };

export default function MoveList({ moves, currentMoveIndex, onMoveClick }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2 text-[var(--cream-dim)] font-[Playfair_Display]">Moves</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0.5">
        {moves.map((move, idx) => (
          <div key={idx} className="flex items-center gap-0.5 py-0.5">
            <span className="mono w-6 text-right text-[10px] md:text-xs text-[var(--cream-muted)]">{move.moveNumber}.</span>
            {move.white && (
              <button onClick={() => onMoveClick(idx * 2)} className={`move-btn text-[10px] md:text-xs px-1.5 md:px-2 py-1 ${currentMoveIndex === idx * 2 ? 'active' : ''}`}>
                {move.white.san}{sy[move.white.classification] && <span className={`ml-0.5 ${bc[move.white.classification]}`}>{sy[move.white.classification]}</span>}
              </button>
            )}
            {move.black && (
              <button onClick={() => onMoveClick(idx * 2 + 1)} className={`move-btn text-[10px] md:text-xs px-1.5 md:px-2 py-1 ${currentMoveIndex === idx * 2 + 1 ? 'active' : ''}`}>
                {move.black.san}{sy[move.black.classification] && <span className={`ml-0.5 ${bc[move.black.classification]}`}>{sy[move.black.classification]}</span>}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
