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
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    getAllGames().then(setSavedGames).catch(() => {});
  }, []);

  const initWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    // Create worker from public folder — avoids webpack bundle issues
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
        setTimeout(() => {
          worker.removeEventListener('message', handler);
          resolve();
        }, 5000);
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

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Chess Analysis</h1>

      <div className="mb-6">
        <LichessLogin onTokenChange={() => {}} />
      </div>

      {!pgn && <PgnUpload onPgnSubmit={handlePgnSubmit} />}

      {progress.status !== 'idle' && (
        <div className="mb-6">
          <AnalysisProgress {...progress} />
        </div>
      )}

      {moves.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <ChessBoard pgn={pgn} currentMoveIndex={currentMoveIndex} />
            <EvalGraph evals={evals} currentMoveIndex={currentMoveIndex} onMoveClick={setCurrentMoveIndex} />
            <div className="flex gap-4 text-sm">
              <div className="bg-gray-900 rounded px-4 py-2">
                <span className="text-gray-400">White ACPL:</span>{' '}
                <span className="font-mono">{whiteACPL}</span>
              </div>
              <div className="bg-gray-900 rounded px-4 py-2">
                <span className="text-gray-400">Black ACPL:</span>{' '}
                <span className="font-mono">{blackACPL}</span>
              </div>
            </div>
          </div>
          <div>
            <MoveList moves={moves} currentMoveIndex={currentMoveIndex} onMoveClick={setCurrentMoveIndex} />
          </div>
        </div>
      )}

      {savedGames.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Saved Games</h2>
          <div className="space-y-2">
            {savedGames.map((game) => (
              <div key={game.id} className="bg-gray-900 rounded p-3 flex justify-between items-center">
                <div>
                  <span className="font-medium">{game.whiteName || 'White'}</span>
                  {' vs '}
                  <span className="font-medium">{game.blackName || 'Black'}</span>
                  <span className="text-gray-500 ml-2">({game.result})</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-500">
                    ACPL: {game.whiteACPL}/{game.blackACPL}
                  </span>
                  <button
                    onClick={() => deleteGame(game.id).then(() => getAllGames().then(setSavedGames).catch(() => {}))}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
