'use client';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useState, useEffect } from 'react';

interface ChessBoardProps {
  pgn: string;
  currentMoveIndex: number;
  orientation?: 'white' | 'black';
  whiteName?: string;
  blackName?: string;
}

export default function ChessBoard({ pgn, currentMoveIndex, orientation = 'white', whiteName, blackName }: ChessBoardProps) {
  const [fen, setFen] = useState('start');

  useEffect(() => {
    const chess = new Chess();
    try { chess.loadPgn(pgn); } catch {}
    const history = chess.history();
    const replay = new Chess();
    for (let i = 0; i <= currentMoveIndex && i < history.length; i++) {
      replay.move(history[i]);
    }
    setFen(replay.fen());
  }, [pgn, currentMoveIndex]);

  return (
    <div className="flex flex-col">
      {/* Black player info (top when white at bottom) */}
      {orientation === 'white' ? (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-medium text-[var(--cream-dim)]">{blackName || 'Black'}</span>
          {whiteName && <span className="text-[10px] text-[var(--cream-muted)]">♔</span>}
        </div>
      ) : (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-medium text-[var(--cream-dim)]">{whiteName || 'White'}</span>
          <span className="text-[10px] text-[var(--cream-muted)]">♚</span>
        </div>
      )}

      <Chessboard
        position={fen}
        boardWidth={400}
        animationDuration={200}
        arePiecesDraggable={false}
        boardOrientation={orientation}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
        }}
      />

      {/* White player info (bottom when white at bottom) */}
      {orientation === 'white' ? (
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-xs font-medium text-[var(--cream-dim)]">{whiteName || 'White'}</span>
          <span className="text-[10px] text-[var(--cream-muted)]">♚</span>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-xs font-medium text-[var(--cream-dim)]">{blackName || 'Black'}</span>
          {whiteName && <span className="text-[10px] text-[var(--cream-muted)]">♔</span>}
        </div>
      )}
    </div>
  );
}
