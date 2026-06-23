'use client';
import { AnalyzedMove, MoveClassification } from '@/types';

interface MoveListProps {
  moves: AnalyzedMove[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

const colors: Record<MoveClassification, string> = {
  best: 'bg-green-600/30 text-green-300',
  excellent: 'bg-green-500/20 text-green-400',
  good: 'bg-gray-700/50 text-gray-300',
  inaccuracy: 'bg-yellow-500/20 text-yellow-400',
  mistake: 'bg-orange-500/20 text-orange-400',
  blunder: 'bg-red-600/20 text-red-400',
};

const symbols: Record<MoveClassification, string> = {
  best: '!!',
  excellent: '!',
  good: '',
  inaccuracy: '?!',
  mistake: '?',
  blunder: '??',
};

export default function MoveList({ moves, currentMoveIndex, onMoveClick }: MoveListProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 max-h-[500px] overflow-y-auto">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Moves</h3>
      <div className="space-y-1">
        {moves.map((move, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 w-8 text-right">{move.moveNumber}.</span>
            {move.white && (
              <button
                onClick={() => onMoveClick(idx * 2)}
                className={`px-2 py-0.5 rounded font-mono ${
                  currentMoveIndex === idx * 2 ? 'ring-2 ring-blue-500' : ''
                } ${colors[move.white.classification]}`}
              >
                {move.white.san}{symbols[move.white.classification]}
              </button>
            )}
            {move.black && (
              <button
                onClick={() => onMoveClick(idx * 2 + 1)}
                className={`px-2 py-0.5 rounded font-mono ${
                  currentMoveIndex === idx * 2 + 1 ? 'ring-2 ring-blue-500' : ''
                } ${colors[move.black.classification]}`}
              >
                {move.black.san}{symbols[move.black.classification]}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
