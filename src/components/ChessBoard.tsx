'use client';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useState, useEffect } from 'react';

interface ChessBoardProps {
  pgn: string;
  currentMoveIndex: number;
}

export default function ChessBoard({ pgn, currentMoveIndex }: ChessBoardProps) {
  const [fen, setFen] = useState('start');

  useEffect(() => {
    const chess = new Chess();
    try { chess.loadPgn(pgn); } catch {}

    const history = chess.history();
    const replay = new Chess();
    for (let i = 0; i < currentMoveIndex && i < history.length; i++) {
      replay.move(history[i]);
    }
    setFen(replay.fen());
  }, [pgn, currentMoveIndex]);

  return (
    <div className="flex justify-center">
      <Chessboard
        position={fen}
        boardWidth={400}
        animationDuration={200}
        arePiecesDraggable={false}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
}
