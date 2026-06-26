'use client';
import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Chessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });

interface Puzzle {
  id: string;
  fen: string;
  rating: number;
  ratingDeviation: number;
  plays: number;
  solution: string[];
  themes: string[];
}

export default function PuzzlesPage() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [chess, setChess] = useState<Chess>(new Chess());
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<'waiting' | 'correct' | 'wrong'>('waiting');
  const [loading, setLoading] = useState(true);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [streak, setStreak] = useState(0);

  const fetchPuzzle = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://lichess.org/api/puzzle/daily');
      const data = await res.json();
      const p = data.puzzle;
      const c = new Chess(p.fen);
      setPuzzle(p);
      setChess(c);
      setMoveIndex(0);
      setStatus('waiting');
      setBoardFlipped(c.turn() === 'b');
    } catch {
      setLoading(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPuzzle(); }, [fetchPuzzle]);

  const onPieceDrop = (source: string, target: string) => {
    if (!puzzle || status !== 'waiting') return false;

    const expectedUci = puzzle.solution[moveIndex];
    const dropUci = source + target;
    const promotion = target.endsWith('8') || target.endsWith('1') ? 'q' : '';

    if (dropUci + promotion === expectedUci || dropUci === expectedUci) {
      const newChess = new Chess(chess.fen());
      const move = newChess.move({ from: source, to: target, promotion: promotion || undefined });
      if (!move) return false;

      setChess(newChess);
      const nextIndex = moveIndex + 1;

      if (nextIndex >= puzzle.solution.length) {
        setStatus('correct');
        setStreak(s => s + 1);
        return true;
      }

      // Auto-reply with opponent's move
      const opponentUci = puzzle.solution[nextIndex];
      const oppMove = newChess.move({
        from: opponentUci.slice(0, 2),
        to: opponentUci.slice(2, 4),
        promotion: opponentUci.length > 4 ? opponentUci[4] : undefined,
      });
      if (oppMove) {
        setChess(newChess);
        setMoveIndex(nextIndex + 1);
      }
      return true;
    }

    setStatus('wrong');
    setStreak(0);
    return false;
  };

  const themeNames: Record<string, string> = {
    fork: 'Fork', pin: 'Pin', skewer: 'Skewer', discoveredAttack: 'Discovered Attack',
    deflection: 'Deflection', deflectionBlocking: 'Deflection', trappedPiece: 'Trapped Piece',
    capture: 'Capture', promotion: 'Promotion', queenSac: 'Queen Sacrifice',
    backRankMate: 'Back Rank', hangingPiece: 'Hanging Piece', intermezzo: 'Intermezzo',
    quietMove: 'Quiet Move', mateIn1: 'Mate in 1', mateIn2: 'Mate in 2', mateIn3: 'Mate in 3+',
    endgame: 'Endgame', opening: 'Opening', middlegame: 'Middlegame',
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.03)_0%,transparent_70%)] float" />
      </div>

      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--gold)] text-[#0a0a0a]">
              <span className="text-sm font-bold font-[Playfair_Display]">♚</span>
            </div>
            <span className="text-base font-semibold text-[var(--cream)] font-[Playfair_Display]">GoatedChess</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/analyse" className="nav-link">Analyze</Link>
            <Link href="/openings" className="nav-link">Openings</Link>
            <Link href="/puzzles" className="nav-link active">Puzzles</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
            <p className="text-[var(--cream-muted)] mt-4 text-sm">Loading daily puzzle...</p>
          </div>
        ) : puzzle ? (
          <div className="flex flex-col items-center gap-8 fade-in">
            {/* Puzzle info */}
            <div className="glass-strong p-4 flex items-center gap-6 text-center">
              <div>
                <div className="mono text-lg font-bold text-[var(--gold)]">{puzzle.rating}</div>
                <div className="text-[10px] text-[var(--cream-muted)] uppercase tracking-wider">Rating</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="mono text-lg font-bold text-[var(--cream)]">{streak}</div>
                <div className="text-[10px] text-[var(--cream-muted)] uppercase tracking-wider">Streak</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="mono text-lg font-bold text-[var(--cream)]">{puzzle.plays.toLocaleString()}</div>
                <div className="text-[10px] text-[var(--cream-muted)] uppercase tracking-wider">Plays</div>
              </div>
            </div>

            {/* Board */}
            <div className="glass p-6 glow-gold">
              <div className="aspect-square w-[360px]">
                <Chessboard
                  position={chess.fen()}
                  onPieceDrop={onPieceDrop}
                  animationDuration={200}
                  boardWidth={360}
                  isDraggablePiece={({ piece }) => {
                    if (status !== 'waiting') return false;
                    return piece[0] === chess.turn();
                  }}
                  boardOrientation={boardFlipped ? 'black' : 'white'}
                  customBoardStyle={{
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                  customDarkSquareStyle={{ backgroundColor: '#2a2a2a' }}
                  customLightSquareStyle={{ backgroundColor: '#404040' }}
                  customSquareStyles={{
                    transition: 'all 0.1s',
                  }}
                />
              </div>
            </div>

            {/* Status */}
            {status === 'correct' && (
              <div className="glass p-4 text-center fade-in border-[var(--green)]/30">
                <div className="text-lg font-semibold text-[var(--green)] mb-1">Correct!</div>
                <p className="text-sm text-[var(--cream-muted)]">
                  {moveIndex >= puzzle.solution.length - 1 ? 'Puzzle solved!' : 'Keep going...'}
                </p>
              </div>
            )}
            {status === 'wrong' && (
              <div className="glass p-4 text-center fade-in border-[var(--red)]/30">
                <div className="text-lg font-semibold text-[var(--red)] mb-1">Incorrect</div>
                <p className="text-sm text-[var(--cream-muted)]">
                  Solution: {puzzle.solution.map((u, i) => {
                    const c = new Chess(puzzle.fen);
                    puzzle.solution.slice(0, i + 1).forEach(m => c.move({ from: m.slice(0, 2), to: m.slice(2, 4), promotion: m[4] }));
                    const lastMove = c.history();
                    return lastMove[lastMove.length - 1];
                  }).join(' ')}
                </p>
              </div>
            )}

            {/* Themes */}
            <div className="flex flex-wrap justify-center gap-2">
              {puzzle.themes.map(t => (
                <span key={t} className="glass text-xs px-3 py-1.5 text-[var(--cream-muted)]">
                  {themeNames[t] || t}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button onClick={() => setBoardFlipped(!boardFlipped)} className="btn-outline px-6">
                ↻ Flip
              </button>
              <button onClick={fetchPuzzle} className="btn px-8">
                Next Puzzle →
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--cream-muted)]">
            Failed to load puzzle. <button onClick={fetchPuzzle} className="text-[var(--gold)] underline">Retry</button>
          </div>
        )}
      </div>
    </main>
  );
}
