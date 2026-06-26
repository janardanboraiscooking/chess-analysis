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
  const [boardSize, setBoardSize] = useState(400);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 640) setBoardSize(Math.min(w - 80, 340));
      else if (w < 1024) setBoardSize(360);
      else setBoardSize(400);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

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

  const labelStyle = { color: 'var(--text-secondary)' } as const;

  return (
    <div className="flex flex-col">
      {orientation === 'white' ? (
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-xs font-medium" style={labelStyle}>{blackName || 'Black'}</span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>♚</span>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-xs font-medium" style={labelStyle}>{whiteName || 'White'}</span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>♔</span>
        </div>
      )}

      <Chessboard
        position={fen}
        boardWidth={boardSize}
        animationDuration={200}
        arePiecesDraggable={false}
        boardOrientation={orientation}
        customDarkSquareStyle={{ backgroundColor: '#3b3b3b' }}
        customLightSquareStyle={{ backgroundColor: '#6b6b6b' }}
        customBoardStyle={{
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      />

      {orientation === 'white' ? (
        <div className="flex items-center justify-between mt-1 px-1">
          <span className="text-xs font-medium" style={labelStyle}>{whiteName || 'White'}</span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>♚</span>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-1 px-1">
          <span className="text-xs font-medium" style={labelStyle}>{blackName || 'Black'}</span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>♔</span>
        </div>
      )}
    </div>
  );
}
