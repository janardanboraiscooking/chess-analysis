'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import PgnUpload from '@/components/PgnUpload';
import ChessBoard from '@/components/ChessBoard';
import MoveList from '@/components/MoveList';
import EvalGraph from '@/components/EvalGraph';
import AnalysisProgress from '@/components/AnalysisProgress';
import LichessLogin from '@/components/LichessLogin';
import { parsePgnToPositions, analyzeGame, hasLichessToken } from '@/engine/analyzer';
import { saveGame, getAllGames, deleteGame } from '@/lib/db';
import { AnalyzedGame, PositionEval } from '@/types';

export default function Home() {
  const [pgn, setPgn] = useState('');
  const [moves, setMoves] = useState<AnalyzedGame['moves']>([]);
  const [evals, setEvals] = useState<PositionEval[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [progress, setProgress] = useState<{current: number; total: number; status: 'idle'|'analyzing'|'done'|'error'; currentMove: string}>({ current: 0, total: 0, status: 'idle', currentMove: '' });
  const [whiteACPL, setWhiteACPL] = useState(0);
  const [blackACPL, setBlackACPL] = useState(0);
  const [savedGames, setSavedGames] = useState<AnalyzedGame[]>([]);
  const [tokenReady, setTokenReady] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    getAllGames().then(setSavedGames).catch(() => {});
    if (!localStorage.getItem('lichess_token') && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        localStorage.setItem('lichess_token', token);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
    setTokenReady(true);
  }, []);

  const initWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const worker = new Worker('/stockfish-worker.js');
    worker.postMessage({ type: 'init' });
    workerRef.current = worker;
    return worker;
  }, []);

  const handlePgnSubmit = useCallback(async (pgnText: string) => {
    setPgn(pgnText);
    setMoves([]);
    setEvals([]);
    setCurrentMoveIndex(0);
    setProgress({ current: 0, total: 0, status: 'analyzing', currentMove: '' });

    try {
      const parsed = parsePgnToPositions(pgnText);
      if (parsed.positions.length < 2) {
        setProgress({ current: 0, total: 0, status: 'error', currentMove: 'Could not parse PGN' });
        return;
      }

      const worker = initWorker();
      await new Promise<void>((resolve) => {
        const handler = (e: MessageEvent) => {
          if (e.data.type === 'ready') {
            worker.removeEventListener('message', handler);
            resolve();
          }
        };
        worker.addEventListener('message', handler);
        setTimeout(() => { worker.removeEventListener('message', handler); resolve(); }, 5000);
      });

      const localEvals: PositionEval[] = [];

      await analyzeGame(
        parsed.positions,
        parsed.sanMoves,
        parsed.moves,
        worker,
        12,
        {
          onProgress: (current, total, move) => {
            setProgress({ current, total, status: 'analyzing', currentMove: move });
          },
          onPositionEval: (index, eval_) => {
            localEvals[index] = eval_;
            setEvals([...localEvals]);
          },
          onComplete: (analyzedMoves, wACPL, bACPL) => {
            setMoves(analyzedMoves);
            setWhiteACPL(wACPL);
            setBlackACPL(bACPL);
            setProgress((p) => ({ ...p, status: 'done' }));

            const game: AnalyzedGame = {
              id: Date.now().toString(),
              whiteName: parsed.whiteName,
              blackName: parsed.blackName,
              result: parsed.result,
              moves: analyzedMoves,
              whiteACPL: wACPL,
              blackACPL: bACPL,
              totalMoves: parsed.sanMoves.length,
              analyzedAt: Date.now(),
            };
            saveGame(game).then(() => getAllGames().then(setSavedGames).catch(() => {}));
          },
          onError: () => {},
        }
      );
    } catch {
      setProgress({ current: 0, total: 0, status: 'error', currentMove: 'Analysis failed' });
    }
  }, [initWorker]);

  const whiteBlunders = moves.filter(m => m.white?.classification === 'blunder').length;
  const blackBlunders = moves.filter(m => m.black?.classification === 'blunder').length;
  const whiteMistakes = moves.filter(m => m.white?.classification === 'mistake').length;
  const blackMistakes = moves.filter(m => m.black?.classification === 'mistake').length;

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Chess Analysis</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Powered by Stockfish</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {tokenReady && <LichessLogin onTokenChange={() => setTokenReady(true)} />}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!pgn && (
          <div className="fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="gradient-text">Analyze Your Games</span>
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Upload a PGN and get instant Stockfish analysis with move classifications
              </p>
            </div>
            <PgnUpload onPgnSubmit={handlePgnSubmit} />
          </div>
        )}

        {progress.status !== 'idle' && (
          <div className="mb-6 fade-in">
            <AnalysisProgress {...progress} />
          </div>
        )}

        {moves.length > 0 && (
          <div className="fade-in">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--text-primary)' }}>{whiteACPL}</div>
                <div className="stat-label">White ACPL</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--text-primary)' }}>{blackACPL}</div>
                <div className="stat-label">Black ACPL</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--red)' }}>{whiteBlunders + blackBlunders}</div>
                <div className="stat-label">Blunders</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--orange)' }}>{whiteMistakes + blackMistakes}</div>
                <div className="stat-label">Mistakes</div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="card p-4 board-glow">
                  <ChessBoard pgn={pgn} currentMoveIndex={currentMoveIndex} />
                </div>
                <div className="card p-4">
                  <EvalGraph evals={evals} currentMoveIndex={currentMoveIndex} onMoveClick={setCurrentMoveIndex} />
                </div>
              </div>
              <div>
                <div className="card p-4 max-h-[700px] overflow-y-auto">
                  <MoveList moves={moves} currentMoveIndex={currentMoveIndex} onMoveClick={setCurrentMoveIndex} />
                </div>
              </div>
            </div>

            {/* Back to Upload */}
            <div className="mt-8 text-center">
              <button
                onClick={() => { setPgn(''); setMoves([]); setEvals([]); setCurrentMoveIndex(0); setProgress({ current: 0, total: 0, status: 'idle', currentMove: '' }); }}
                className="btn-primary"
              >
                Analyze Another Game
              </button>
            </div>
          </div>
        )}

        {/* Saved Games */}
        {savedGames.length > 0 && !pgn && (
          <div className="mt-12 fade-in">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Saved Games</h2>
            <div className="space-y-2">
              {savedGames.map((game) => (
                <div key={game.id} className="card p-4 flex justify-between items-center hover:border-gray-600 transition-colors">
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{game.whiteName || 'White'}</span>
                    <span style={{ color: 'var(--text-muted)' }}> vs </span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{game.blackName || 'Black'}</span>
                    <span className="ml-2 text-sm" style={{ color: 'var(--text-muted)' }}>({game.result})</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      ACPL: {game.whiteACPL}/{game.blackACPL}
                    </span>
                    <button
                      onClick={() => deleteGame(game.id).then(() => getAllGames().then(setSavedGames).catch(() => {}))}
                      className="text-xs hover:text-red-400 transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
