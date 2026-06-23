'use client';
import { AnalyzedMove, MoveClassification } from '@/types';

interface MoveListProps {
  moves: AnalyzedMove[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

const badgeClass: Record<MoveClassification, string> = {
  best: 'badge-best',
  excellent: 'badge-excellent',
  good: 'badge-good',
  inaccuracy: 'badge-inaccuracy',
  mistake: 'badge-mistake',
  blunder: 'badge-blunder',
};

const symbol: Record<MoveClassification, string> = {
  best: '!!',
  excellent: '!',
  good: '',
  inaccuracy: '?!',
  mistake: '?',
  blunder: '??',
};

export default function MoveList({ moves, currentMoveIndex, onMoveClick }: MoveListProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Moves</h3>
      <div className="space-y-0.5">
        {moves.map((move, idx) => (
          <div key={idx} className="flex items-center gap-1 text-sm py-0.5">
            <span className="w-8 text-right font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              {move.moveNumber}.
            </span>
            {move.white && (
              <button
                onClick={() => onMoveClick(idx * 2)}
                className={`move-btn ${currentMoveIndex === idx * 2 ? 'active' : ''}`}
              >
                {move.white.san}
                {symbol[move.white.classification] && (
                  <span className={`ml-1 ${badgeClass[move.white.classification]}`}>
                    {symbol[move.white.classification]}
                  </span>
                )}
              </button>
            )}
            {move.black && (
              <button
                onClick={() => onMoveClick(idx * 2 + 1)}
                className={`move-btn ${currentMoveIndex === idx * 2 + 1 ? 'active' : ''}`}
              >
                {move.black.san}
                {symbol[move.black.classification] && (
                  <span className={`ml-1 ${badgeClass[move.black.classification]}`}>
                    {symbol[move.black.classification]}
                  </span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
