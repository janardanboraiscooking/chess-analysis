'use client';
import { AnalyzedMove, MoveClassification } from '@/types';

interface Props { moves: AnalyzedMove[]; currentMoveIndex: number; onMoveClick: (i: number) => void; }

const sy: Record<MoveClassification, string> = { best: '!!', excellent: '!', good: '', inaccuracy: '?!', mistake: '?', blunder: '??' };

export default function MoveList({ moves, currentMoveIndex, onMoveClick }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0.5">
      {moves.map((move, idx) => (
        <div key={idx} className="flex items-center gap-0.5 py-0.5">
          <span className="mono w-6 text-right text-[10px]" style={{ color: 'var(--text-muted)' }}>{move.moveNumber}.</span>
          {move.white && (
            <button onClick={() => onMoveClick(idx * 2)}
              className="mono text-[11px] px-1.5 py-1 rounded transition-all duration-150"
              style={{
                background: currentMoveIndex === idx * 2 ? 'rgba(232,197,71,0.1)' : 'transparent',
                color: currentMoveIndex === idx * 2 ? 'var(--gold)' : 'var(--text-secondary)',
                border: currentMoveIndex === idx * 2 ? '1px solid rgba(232,197,71,0.2)' : '1px solid transparent',
              }}>
              {move.white.san}{sy[move.white.classification] && <span className={`ml-0.5 badge-${move.white.classification}`}>{sy[move.white.classification]}</span>}
            </button>
          )}
          {move.black && (
            <button onClick={() => onMoveClick(idx * 2 + 1)}
              className="mono text-[11px] px-1.5 py-1 rounded transition-all duration-150"
              style={{
                background: currentMoveIndex === idx * 2 + 1 ? 'rgba(232,197,71,0.1)' : 'transparent',
                color: currentMoveIndex === idx * 2 + 1 ? 'var(--gold)' : 'var(--text-secondary)',
                border: currentMoveIndex === idx * 2 + 1 ? '1px solid rgba(232,197,71,0.2)' : '1px solid transparent',
              }}>
              {move.black.san}{sy[move.black.classification] && <span className={`ml-0.5 badge-${move.black.classification}`}>{sy[move.black.classification]}</span>}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
