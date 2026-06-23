'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import PgnUpload from '@/components/PgnUpload';
import ChessBoard from '@/components/ChessBoard';
import MoveList from '@/components/MoveList';
import EvalGraph from '@/components/EvalGraph';
import AnalysisProgress from '@/components/AnalysisProgress';
import { parsePgnToPositions, analyzeGame } from '@/engine/analyzer';
import { saveGame, getAllGames, deleteGame } from '@/lib/db';
import { AnalyzedGame, PositionEval } from '@/types';

export default function AnalysePage() {
  const [pgn, setPgn] = useState('');
  const [gameInfo, setGameInfo] = useState<{ white: string; black: string; result: string } | null>(null);
  const [moves, setMoves] = useState<AnalyzedGame['moves']>([]);
  const [evals, setEvals] = useState<PositionEval[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [progress, setProgress] = useState<{current: number; total: number; status: 'idle'|'analyzing'|'done'|'error'; currentMove: string}>({ current: 0, total: 0, status: 'idle', currentMove: '' });
  const [whiteACPL, setWhiteACPL] = useState(0);
  const [blackACPL, setBlackACPL] = useState(0);
  const [savedGames, setSavedGames] = useState<AnalyzedGame[]>([]);
  const [activeTab, setActiveTab] = useState<'moves' | 'details'>('moves');
  const [flipped, setFlipped] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => { getAllGames().then(setSavedGames).catch(() => {}); }, []);

  const initWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;
    const w = new Worker('/stockfish-worker.js');
    w.postMessage({ type: 'init' });
    workerRef.current = w;
    return w;
  }, []);

  const handlePgnSubmit = useCallback(async (pgnText: string) => {
    setPgn(pgnText); setMoves([]); setEvals([]); setCurrentMoveIndex(0); setGameInfo(null); setFlipped(false);
    setProgress({ current: 0, total: 0, status: 'analyzing', currentMove: '' });
    try {
      const parsed = parsePgnToPositions(pgnText);
      if (parsed.positions.length < 2) { setProgress({ current: 0, total: 0, status: 'error', currentMove: 'Could not parse PGN' }); return; }
      setGameInfo({ white: parsed.whiteName, black: parsed.blackName, result: parsed.result });
      const worker = initWorker();
      await new Promise<void>((resolve) => {
        const handler = (e: MessageEvent) => { if (e.data.type === 'ready') { worker.removeEventListener('message', handler); resolve(); } };
        worker.addEventListener('message', handler);
        setTimeout(() => { worker.removeEventListener('message', handler); resolve(); }, 15000);
      });
      const le: PositionEval[] = [];
      await analyzeGame(parsed.positions, parsed.sanMoves, parsed.moves, worker, 10, {
        onProgress: (c, t, m) => setProgress({ current: c, total: t, status: 'analyzing', currentMove: m }),
        onPositionEval: (i, e) => { le[i] = e; setEvals([...le]); },
        onComplete: (am, wA, bA) => {
          setMoves(am); setWhiteACPL(wA); setBlackACPL(bA);
          setProgress((p) => ({ ...p, status: 'done' }));
          saveGame({ id: Date.now().toString(), whiteName: parsed.whiteName, blackName: parsed.blackName, result: parsed.result, moves: am, whiteACPL: wA, blackACPL: bA, totalMoves: parsed.sanMoves.length, analyzedAt: Date.now() }).then(() => getAllGames().then(setSavedGames).catch(() => {}));
        },
        onError: () => {},
      });
    } catch { setProgress({ current: 0, total: 0, status: 'error', currentMove: 'Failed' }); }
  }, [initWorker]);

  const wb = moves.filter(m => m.white?.classification === 'blunder').length;
  const bb = moves.filter(m => m.black?.classification === 'blunder').length;
  const wm = moves.filter(m => m.white?.classification === 'mistake').length;
  const bm = moves.filter(m => m.black?.classification === 'mistake').length;
  const wi = moves.filter(m => m.white?.classification === 'inaccuracy').length;
  const bi = moves.filter(m => m.black?.classification === 'inaccuracy').length;
  const wbe = moves.filter(m => m.white?.classification === 'best' || m.white?.classification === 'excellent').length;
  const bbe = moves.filter(m => m.black?.classification === 'best' || m.black?.classification === 'excellent').length;
  const total = moves.length * 2;

  const curEval = evals[currentMoveIndex];
  const rawEvalCp = curEval?.eval ?? 0;
  const evalCp = flipped ? -rawEvalCp : rawEvalCp;
  const evalPawns = (evalCp / 100).toFixed(2);
  const evalSide = evalCp > 0 ? (flipped ? 'Black' : 'White') : evalCp < 0 ? (flipped ? 'White' : 'Black') : 'Equal';

  const curMove = currentMoveIndex < total
    ? moves[Math.floor(currentMoveIndex / 2)]?.[currentMoveIndex % 2 === 0 ? 'white' : 'black']
    : null;

  const reset = () => { setPgn(''); setMoves([]); setEvals([]); setCurrentMoveIndex(0); setGameInfo(null); setFlipped(false); setProgress({ current: 0, total: 0, status: 'idle', currentMove: '' }); };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-[#222] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--gold)] text-[#0a0a0a]">
                <span className="text-sm font-bold font-[Playfair_Display]">♚</span>
              </div>
              <span className="text-base font-semibold text-[var(--cream)] font-[Playfair_Display]">GoatedChess</span>
            </Link>
            <span className="text-sm text-[var(--cream-muted)]">/</span>
            <span className="text-sm text-[var(--cream-dim)]">Analyze</span>
          </div>
          {gameInfo && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[var(--cream-dim)]">{gameInfo.white} vs {gameInfo.black}</span>
              <span className="mono px-2 py-0.5 rounded text-xs bg-[#111] text-[var(--cream-muted)]">{gameInfo.result}</span>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {!pgn && (
          <div className="fade-in">
            <div className="text-center mb-10">
              <div className="gold-line w-12 mx-auto mb-6" />
              <h1 className="text-4xl font-bold mb-3 text-[var(--cream)]">Analyze a Game</h1>
              <p className="text-base text-[var(--cream-dim)]">Upload a PGN to get instant Stockfish analysis</p>
            </div>
            <PgnUpload onPgnSubmit={handlePgnSubmit} />
            {savedGames.length > 0 && (
              <div className="mt-12 max-w-2xl mx-auto">
                <div className="gold-line w-8 mb-6" />
                <h2 className="text-xl font-bold mb-4 text-[var(--cream)]">Recent Games</h2>
                <div className="space-y-2">
                  {savedGames.slice(0, 5).map((g) => (
                    <div key={g.id} className="card p-3 flex justify-between items-center cursor-pointer" onClick={() => {
                      setPgn(''); setGameInfo({ white: g.whiteName, black: g.blackName, result: g.result });
                      setMoves(g.moves); setWhiteACPL(g.whiteACPL); setBlackACPL(g.blackACPL);
                      setProgress({ current: g.totalMoves, total: g.totalMoves, status: 'done', currentMove: '' });
                    }}>
                      <div>
                        <span className="font-medium text-sm text-[var(--cream)]">{g.whiteName}</span>
                        <span className="text-sm text-[var(--cream-muted)]"> vs </span>
                        <span className="font-medium text-sm text-[var(--cream)]">{g.blackName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="mono text-xs text-[var(--cream-muted)]">ACPL {g.whiteACPL}/{g.blackACPL}</span>
                        <button onClick={(e) => { e.stopPropagation(); deleteGame(g.id).then(() => getAllGames().then(setSavedGames).catch(() => {})); }} className="text-xs hover:opacity-60 text-[var(--cream-muted)]">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {progress.status !== 'idle' && <div className="mb-4 fade-in"><AnalysisProgress {...progress} /></div>}

        {moves.length > 0 && (
          <div className="fade-in">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4 stagger">
              {[
                { v: whiteACPL, l: 'W ACPL', c: '' }, { v: blackACPL, l: 'B ACPL', c: '' },
                { v: wb + bb, l: 'Blunders', c: 'text-[var(--red)]' }, { v: wm + bm, l: 'Mistakes', c: 'text-[var(--amber)]' },
                { v: wi + bi, l: 'Inaccuracies', c: 'text-[var(--cream-dim)]' }, { v: wbe + bbe, l: 'Best/Exc', c: 'text-[var(--green)]' },
              ].map((s) => (
                <div key={s.l} className="stat py-2 md:py-3">
                  <div className={`text-lg md:text-xl font-[Playfair_Display] font-bold text-[var(--cream)] ${s.c}`}>{s.v}</div>
                  <div className="text-[9px] md:text-[10px] text-[var(--cream-muted)] mt-1 uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="col-span-1 lg:col-span-5 space-y-3">
                <div className="card p-2 md:p-3">
                  <div className="flex gap-2 md:gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="mono text-[9px] md:text-[10px] text-[var(--cream-muted)]">{evalSide}</span>
                      <div className="eval-bar-container h-64 md:h-80">
                        <div className="eval-bar-fill" style={{ height: `${Math.min(100, Math.max(5, 50 + (evalCp / 100) * 2))}%`, background: evalCp >= 0 ? 'var(--cream)' : '#333' }} />
                      </div>
                      <span className="mono text-[10px] md:text-xs font-semibold" style={{ color: evalCp > 0 ? 'var(--cream)' : 'var(--cream-muted)' }}>
                        {evalCp > 0 ? '+' : ''}{evalPawns}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <ChessBoard pgn={pgn} currentMoveIndex={currentMoveIndex} orientation={flipped ? 'black' : 'white'} whiteName={gameInfo?.white} blackName={gameInfo?.black} />
                    </div>
                  </div>
                  <div className="flex justify-center mt-2">
                    <button onClick={() => setFlipped(!flipped)} className="text-xs px-3 py-1.5 rounded-md transition-colors hover:bg-[#111] text-[var(--cream-muted)] hover:text-[var(--cream-dim)]">↻ Flip Board</button>
                  </div>
                </div>
                <div className="card p-2 md:p-3">
                  <EvalGraph evals={evals} currentMoveIndex={currentMoveIndex} onMoveClick={setCurrentMoveIndex} flipped={flipped} />
                </div>
              </div>

              <div className="col-span-1 lg:col-span-7 space-y-3">
                {curMove && (
                  <div className="card p-3 md:p-4 fade-in" key={currentMoveIndex}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="mono text-xs md:text-sm font-semibold text-[var(--cream)]">
                          {Math.floor(currentMoveIndex / 2) + 1}.{currentMoveIndex % 2 === 0 ? '' : '...'}{curMove.san}
                        </span>
                        <span className={`badge badge-${curMove.classification}`}>{curMove.classification}</span>
                      </div>
                      <span className="mono text-[10px] md:text-xs text-[var(--cream-muted)]">
                        {curMove.evalBefore > 0 ? '+' : ''}{(curMove.evalBefore / 100).toFixed(2)} → {curMove.evalAfter > 0 ? '+' : ''}{(curMove.evalAfter / 100).toFixed(2)}
                      </span>
                    </div>
                    {curMove.bestMove && curMove.evalLoss > 0 && (
                      <p className="text-xs text-[var(--cream-muted)]">
                        Best: <span className="mono text-[var(--gold)]">{curMove.bestMove}</span> · Lost {curMove.evalLoss}cp
                      </p>
                    )}
                    {curMove.pv.length > 0 && (
                      <div className="mt-2 pv-line">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--cream-muted)]">Line: </span>
                        {curMove.pv.slice(0, 8).map((m, i) => <span key={i} className="pv-move">{m} </span>)}
                      </div>
                    )}
                  </div>
                )}
                <div className="card">
                  <div className="flex border-b border-[#222]">
                    {(['moves', 'details'] as const).map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className="flex-1 py-2.5 text-sm font-medium transition-colors" style={{ color: activeTab === tab ? 'var(--gold)' : 'var(--cream-muted)', borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent' }}>
                        {tab === 'moves' ? 'Moves' : 'Details'}
                      </button>
                    ))}
                  </div>
                  <div className="p-3 max-h-[400px] overflow-y-auto">
                    {activeTab === 'moves' ? (
                      <MoveList moves={moves} currentMoveIndex={currentMoveIndex} onMoveClick={setCurrentMoveIndex} />
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-[var(--cream-muted)]">{gameInfo?.white || 'White'} Accuracy</h4>
                          <div className="w-full rounded-full h-2 bg-[#111]"><div className="h-2 rounded-full bg-[var(--green)]" style={{ width: `${total > 0 ? (wbe / (total / 2)) * 100 : 0}%` }} /></div>
                          <p className="mono text-xs mt-1 text-[var(--cream-muted)]">{wbe}/{total / 2} best/excellent</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-[var(--cream-muted)]">{gameInfo?.black || 'Black'} Accuracy</h4>
                          <div className="w-full rounded-full h-2 bg-[#111]"><div className="h-2 rounded-full bg-[var(--green)]" style={{ width: `${total > 0 ? (bbe / (total / 2)) * 100 : 0}%` }} /></div>
                          <p className="mono text-xs mt-1 text-[var(--cream-muted)]">{bbe}/{total / 2} best/excellent</p>
                        </div>
                        <div className="h-px bg-[#222]" />
                        <div>
                          <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-[var(--cream-muted)]">Breakdown</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {[
                              ['Best', moves.filter(m => m.white?.classification === 'best' || m.black?.classification === 'best').length, 'text-[var(--green)]'],
                              ['Excellent', moves.filter(m => m.white?.classification === 'excellent' || m.black?.classification === 'excellent').length, 'text-[var(--green)]'],
                              ['Good', moves.filter(m => m.white?.classification === 'good' || m.black?.classification === 'good').length, 'text-[var(--cream-dim)]'],
                              ['Inaccuracy', wi + bi, 'text-[var(--amber)]'],
                              ['Mistake', wm + bm, 'text-[#e05545]'],
                              ['Blunder', wb + bb, 'text-[var(--red)]'],
                            ].map(([l, v, c]) => (
                              <div key={l} className="flex justify-between"><span className="text-[var(--cream-dim)]">{l}</span><span className={`mono ${c}`}>{v}</span></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button onClick={reset} className="btn-outline">Analyze Another Game</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
