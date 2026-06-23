'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import PgnUpload from '@/components/PgnUpload';
import ChessBoard from '@/components/ChessBoard';
import MoveList from '@/components/MoveList';
import EvalGraph from '@/components/EvalGraph';
import AnalysisProgress from '@/components/AnalysisProgress';
import { parsePgnToPositions, analyzeGame } from '@/engine/analyzer';
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
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    getAllGames().then(setSavedGames).catch(() => {});
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
          if (e.data.type === 'ready') { worker.removeEventListener('message', handler); resolve(); }
        };
        worker.addEventListener('message', handler);
        setTimeout(() => { worker.removeEventListener('message', handler); resolve(); }, 5000);
      });
      const localEvals: PositionEval[] = [];
      await analyzeGame(parsed.positions, parsed.sanMoves, parsed.moves, worker, 14, {
        onProgress: (current, total, move) => setProgress({ current, total, status: 'analyzing', currentMove: move }),
        onPositionEval: (index, eval_) => { localEvals[index] = eval_; setEvals([...localEvals]); },
        onComplete: (analyzedMoves, wACPL, bACPL) => {
          setMoves(analyzedMoves);
          setWhiteACPL(wACPL);
          setBlackACPL(bACPL);
          setProgress((p) => ({ ...p, status: 'done' }));
          const game: AnalyzedGame = {
            id: Date.now().toString(),
            whiteName: parsed.whiteName, blackName: parsed.blackName,
            result: parsed.result, moves: analyzedMoves,
            whiteACPL: wACPL, blackACPL: bACPL,
            totalMoves: parsed.sanMoves.length, analyzedAt: Date.now(),
          };
          saveGame(game).then(() => getAllGames().then(setSavedGames).catch(() => {}));
        },
        onError: () => {},
      });
    } catch {
      setProgress({ current: 0, total: 0, status: 'error', currentMove: 'Analysis failed' });
    }
  }, [initWorker]);

  const whiteBlunders = moves.filter(m => m.white?.classification === 'blunder').length;
  const blackBlunders = moves.filter(m => m.black?.classification === 'blunder').length;
  const whiteMistakes = moves.filter(m => m.white?.classification === 'mistake').length;
  const blackMistakes = moves.filter(m => m.black?.classification === 'mistake').length;
  const whiteInacc = moves.filter(m => m.white?.classification === 'inaccuracy').length;
  const blackInacc = moves.filter(m => m.black?.classification === 'inaccuracy').length;

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--bg)' }}>
              <span className="text-sm font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>♚</span>
            </div>
            <span className="text-lg font-semibold tracking-tight" style={{ color: 'var(--white)', fontFamily: 'Playfair Display, serif' }}>
              GoatedChess
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {!pgn && (
          <div className="fade-in">
            <div className="text-center mb-12">
              <div className="gold-line w-16 mx-auto mb-6" />
              <h1 className="text-5xl font-bold mb-3 tracking-tight" style={{ color: 'var(--white)' }}>
                Analyze Your Games
              </h1>
              <p className="text-base" style={{ color: 'var(--cream-dim)' }}>
                Upload a PGN. Get instant Stockfish analysis.
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 stagger">
              <div className="stat">
                <div className="stat-value">{whiteACPL}</div>
                <div className="stat-label">White ACPL</div>
              </div>
              <div className="stat">
                <div className="stat-value">{blackACPL}</div>
                <div className="stat-label">Black ACPL</div>
              </div>
              <div className="stat">
                <div className="stat-value" style={{ color: 'var(--red)' }}>{whiteBlunders + blackBlunders}</div>
                <div className="stat-label">Blunders</div>
              </div>
              <div className="stat">
                <div className="stat-value" style={{ color: 'var(--amber)' }}>{whiteMistakes + blackMistakes}</div>
                <div className="stat-label">Mistakes</div>
              </div>
              <div className="stat">
                <div className="stat-value" style={{ color: 'var(--cream-dim)' }}>{whiteInacc + blackInacc}</div>
                <div className="stat-label">Inaccuracies</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-4">
                <div className="card p-4">
                  <ChessBoard pgn={pgn} currentMoveIndex={currentMoveIndex} />
                </div>
                <div className="card p-4">
                  <EvalGraph evals={evals} currentMoveIndex={currentMoveIndex} onMoveClick={setCurrentMoveIndex} />
                </div>
              </div>
              <div className="card p-4 max-h-[700px] overflow-y-auto">
                <MoveList moves={moves} currentMoveIndex={currentMoveIndex} onMoveClick={setCurrentMoveIndex} />
              </div>
            </div>

            <div className="mt-8 text-center">
              <button onClick={() => { setPgn(''); setMoves([]); setEvals([]); setCurrentMoveIndex(0); setProgress({ current: 0, total: 0, status: 'idle', currentMove: '' }); }} className="btn-outline">
                Analyze Another Game
              </button>
            </div>
          </div>
        )}

        {savedGames.length > 0 && !pgn && (
          <div className="mt-12 fade-in">
            <div className="gold-line w-12 mb-6" />
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--white)' }}>Saved Games</h2>
            <div className="space-y-2">
              {savedGames.map((game) => (
                <div key={game.id} className="card p-4 flex justify-between items-center" style={{ transition: 'border-color 0.2s' }}>
                  <div>
                    <span className="font-semibold" style={{ color: 'var(--white)' }}>{game.whiteName || 'White'}</span>
                    <span style={{ color: 'var(--cream-muted)' }}> vs </span>
                    <span className="font-semibold" style={{ color: 'var(--white)' }}>{game.blackName || 'Black'}</span>
                    <span className="ml-2 text-sm" style={{ color: 'var(--cream-muted)' }}>({game.result})</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="mono text-xs" style={{ color: 'var(--cream-muted)' }}>
                      ACPL {game.whiteACPL}/{game.blackACPL}
                    </span>
                    <button onClick={() => deleteGame(game.id).then(() => getAllGames().then(setSavedGames).catch(() => {}))} className="text-xs hover:opacity-70 transition-opacity" style={{ color: 'var(--cream-muted)' }}>
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
