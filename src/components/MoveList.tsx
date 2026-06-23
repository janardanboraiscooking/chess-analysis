'use client';
import { AnalyzedMove, MoveClassification } from '@/types';

interface MoveListProps {
  moves: AnalyzedMove[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

const badgeClass: Record<MoveClassification, string> = {
  best: 'badge-best', excellent: 'badge-excellent', good: 'badge-good',
  inaccuracy: 'badge-inaccuracy', mistake: 'badge-mistake', blunder: 'badge-blunder',
};

const sym: Record<MoveClassification, string> = {
  best: '!!', excellent: '!', good: '', inaccuracy: '?!', mistake: '?', blunder: '??',
};

export default function MoveList({ moves, currentMoveIndex, onMoveClick }: MoveListProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--cream-dim)', fontFamily: 'Playfair Display, serif' }}>Moves</h3>
      <div className="space-y-0.5">
        {moves.map((move, idx) => (
          <div key={idx} className="flex items-center gap-1 py-0.5">
            <span className="mono w-7 text-right text-xs" style={{ color: 'var(--cream-muted)' }}>{move.moveNumber}.</span>
            {move.white && (
              <button onClick={() => onMoveClick(idx * 2)} className={`move-btn ${currentMoveIndex === idx * 2 ? 'active' : ''}`}>
                {move.white.san}
                {sym[move.white.classification] && (
                  <span className={`ml-1 ${badgeClass[move.white.classification]}`}>{sym[move.white.classification]}</span>
                )}
              </button>
            )}
            {move.black && (
              <button onClick={() => onMoveClick(idx * 2 + 1)} className={`move-btn ${currentMoveIndex === idx * 2 + 1 ? 'active' : ''}`}>
                {move.black.san}
                {sym[move.black.classification] && (
                  <span className={`ml-1 ${badgeClass[move.black.classification]}`}>{sym[move.black.classification]}</span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
