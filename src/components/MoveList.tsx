'use client';
import { AnalyzedMove, MoveClassification } from '@/types';

interface Props { moves: AnalyzedMove[]; currentMoveIndex: number; onMoveClick: (i: number) => void; }

const icons: Record<MoveClassification, { icon: string; color: string }> = {
  best: { icon: '!!', color: '#22c55e' },
  excellent: { icon: '!', color: '#4ade80' },
  good: { icon: '', color: '' },
  inaccuracy: { icon: '?', color: '#facc15' },
  mistake: { icon: '?!', color: '#f97316' },
  blunder: { icon: '??', color: '#ef4444' },
};

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
              {move.white.san}
              {move.white.classification !== 'best' && move.white.classification !== 'excellent' && move.white.classification !== 'good' && (
                <span className="ml-0.5 text-[9px] font-bold" style={{ color: icons[move.white.classification]?.color }}>{icons[move.white.classification]?.icon}</span>
              )}
              {move.white.classification === 'best' && (
                <span className="ml-0.5 text-[9px] font-bold" style={{ color: '#22c55e' }}>!!</span>
              )}
              {move.white.classification === 'excellent' && (
                <span className="ml-0.5 text-[9px] font-bold" style={{ color: '#4ade80' }}>!</span>
              )}
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
              {move.black.san}
              {move.black.classification !== 'best' && move.black.classification !== 'excellent' && move.black.classification !== 'good' && (
                <span className="ml-0.5 text-[9px] font-bold" style={{ color: icons[move.black.classification]?.color }}>{icons[move.black.classification]?.icon}</span>
              )}
              {move.black.classification === 'best' && (
                <span className="ml-0.5 text-[9px] font-bold" style={{ color: '#22c55e' }}>!!</span>
              )}
              {move.black.classification === 'excellent' && (
                <span className="ml-0.5 text-[9px] font-bold" style={{ color: '#4ade80' }}>!</span>
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
