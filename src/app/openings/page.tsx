'use client';
import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Chessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });

interface OpeningMove {
  san: string;
  uci: string;
  white: number;
  draws: number;
  black: number;
  avgRating: number;
  performance: number;
  opening?: { eco: string; name: string };
}

interface ExplorerData {
  openings: OpeningMove[];
  topGames: any[];
  recentGames: any[];
}

export default function OpeningsPage() {
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [moves, setMoves] = useState<string[]>([]);
  const [data, setData] = useState<ExplorerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');

  const boardFen = playerColor === 'black' ? flipFen(fen) : fen;

  const fetchExplorer = useCallback(async (f: string) => {
    setLoading(true);
    try {
      const encoded = encodeURIComponent(f);
      const res = await fetch(`https://explorer.lichess.ovh/masters?fen=${encoded}&topGames=0&recentGames=0`);
      const d = await res.json();
      setData(d);
    } catch {
      setData(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchExplorer(fen); }, [fen, fetchExplorer]);

  const playMove = (san: string) => {
    try {
      const chess = new Chess(fen);
      const move = chess.move(san);
      if (move) {
        setFen(chess.fen());
        setMoves([...moves, san]);
      }
    } catch {}
  };

  const undo = () => {
    if (moves.length === 0) return;
    const chess = new Chess();
    const newMoves = moves.slice(0, -1);
    newMoves.forEach(m => chess.move(m));
    setFen(chess.fen());
    setMoves(newMoves);
  };

  const reset = () => {
    setFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    setMoves([]);
  };

  const totalGames = (m: OpeningMove) => m.white + m.draws + m.black;
  const winPercent = (m: OpeningMove) => {
    const total = totalGames(m);
    return total > 0 ? ((m.white + m.draws * 0.5) / total * 100).toFixed(1) : '0';
  };

  const currentOpening = data?.openings?.[0]?.opening;

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.03)_0%,transparent_70%)] float" />
      </div>

      {/* Header */}
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
            <Link href="/openings" className="nav-link active">Openings</Link>
            <Link href="/puzzles" className="nav-link">Puzzles</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Opening name */}
        {currentOpening && (
          <div className="glass-strong p-4 mb-6 text-center fade-in">
            <span className="mono text-[var(--gold)] font-semibold">{currentOpening.eco}</span>
            <span className="mx-3 text-[var(--cream-muted)]">·</span>
            <span className="text-[var(--cream)]">{currentOpening.name}</span>
          </div>
        )}

        {/* Move trail */}
        {moves.length > 0 && (
          <div className="glass p-3 mb-6 flex items-center gap-2 flex-wrap fade-in">
            <button onClick={undo} className="text-xs px-3 py-1.5 rounded-lg bg-[var(--gold-glow)] text-[var(--gold)] hover:bg-[var(--gold-dim)] hover:text-[#0a0a0a] transition-all">
              ← Back
            </button>
            <button onClick={reset} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-[var(--cream-muted)] hover:bg-white/10 transition-all">
              Reset
            </button>
            <div className="ml-2 mono text-xs text-[var(--cream-muted)]">
              {moves.map((m, i) => (
                <span key={i}>
                  {i % 2 === 0 && <span className="text-[var(--cream-muted)] mr-1">{Math.floor(i / 2) + 1}.</span>}
                  <span className="text-[var(--cream-dim)] hover:text-[var(--gold)] cursor-pointer" onClick={() => {
                    const newMoves = moves.slice(0, i + 1);
                    const chess = new Chess();
                    newMoves.forEach(m => chess.move(m));
                    setFen(chess.fen());
                    setMoves(newMoves);
                  }}>{m}</span>
                  {' '}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Board */}
          <div className="glass p-4 fade-in">
            <div className="aspect-square">
              <Chessboard
                position={boardFen}
                animationDuration={200}
                arePiecesDraggable={false}
                boardWidth={296}
                customBoardStyle={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
                customDarkSquareStyle={{ backgroundColor: '#2a2a2a' }}
                customLightSquareStyle={{ backgroundColor: '#404040' }}
              />
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={() => setPlayerColor('white')} className={`text-xs px-4 py-1.5 rounded-lg transition-all ${playerColor === 'white' ? 'bg-[var(--gold)] text-[#0a0a0a]' : 'bg-white/5 text-[var(--cream-muted)] hover:bg-white/10'}`}>
                Play as White
              </button>
              <button onClick={() => setPlayerColor('black')} className={`text-xs px-4 py-1.5 rounded-lg transition-all ${playerColor === 'black' ? 'bg-[var(--gold)] text-[#0a0a0a]' : 'bg-white/5 text-[var(--cream-muted)] hover:bg-white/10'}`}>
                Play as Black
              </button>
            </div>
          </div>

          {/* Moves table */}
          <div className="glass p-6 fade-in">
            <h3 className="text-lg font-semibold mb-4 text-[var(--cream)]">
              {loading ? 'Loading...' : `Master Games (${data?.openings?.reduce((s, m) => s + totalGames(m), 0)?.toLocaleString() || 0})`}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-[var(--cream-muted)] font-medium">Move</th>
                    <th className="text-right py-2 text-[var(--cream-muted)] font-medium">Games</th>
                    <th className="text-right py-2 text-[var(--cream-muted)] font-medium">White %</th>
                    <th className="text-right py-2 text-[var(--cream-muted)] font-medium">Draw %</th>
                    <th className="text-right py-2 text-[var(--cream-muted)] font-medium">Avg Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.openings?.sort((a, b) => totalGames(b) - totalGames(a)).map((m) => (
                    <tr key={m.uci}
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() => playMove(m.san)}>
                      <td className="py-2.5">
                        <span className="font-semibold text-[var(--cream)]">{m.san}</span>
                        {m.opening && (
                          <span className="ml-2 mono text-[10px] text-[var(--gold)]">{m.opening.eco}</span>
                        )}
                      </td>
                      <td className="text-right py-2.5 mono text-[var(--cream-dim)]">{totalGames(m).toLocaleString()}</td>
                      <td className="text-right py-2.5 mono text-[var(--green)]">{winPercent(m)}%</td>
                      <td className="text-right py-2.5 mono text-[var(--cream-muted)]">{totalGames(m) > 0 ? (m.draws / totalGames(m) * 100).toFixed(1) : 0}%</td>
                      <td className="text-right py-2.5 mono text-[var(--cream-muted)]">{m.avgRating || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(!data?.openings || data.openings.length === 0) && !loading && (
              <div className="text-center py-12 text-[var(--cream-muted)]">
                <p className="text-sm">No master games found for this position.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function flipFen(fen: string): string {
  const parts = fen.split(' ');
  const rows = parts[0].split('/');
  const flipped = rows.reverse().map(row => {
    return row.split('').map(c => {
      if (c === uppercase(c)) return c.toLowerCase();
      if (c === lowercase(c)) return c.toUpperCase();
      return c;
    }).join('');
  }).join('/');
  const newTurn = parts[1] === 'w' ? 'b' : 'w';
  return `${flipped} ${newTurn} ${parts.slice(2).join(' ')}`;
}

function uppercase(c: string): string { return c === c.toUpperCase() ? c : c; }
function lowercase(c: string): string { return c === c.toLowerCase() ? c : c; }
