'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import PgnUpload from '@/components/PgnUpload';
import ImportGame from '@/components/ImportGame';
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
  const [whiteAccuracy, setWhiteAccuracy] = useState(0);
  const [blackAccuracy, setBlackAccuracy] = useState(0);
  const [savedGames, setSavedGames] = useState<AnalyzedGame[]>([]);
  const [activeTab, setActiveTab] = useState<'moves' | 'details'>('moves');
  const [flipped, setFlipped] = useState(false);
  const [importMode, setImportMode] = useState(false);
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
      await analyzeGame(parsed.positions, parsed.sanMoves, parsed.moves, worker, 16, {
        onProgress: (c, t, m) => setProgress({ current: c, total: t, status: 'analyzing', currentMove: m }),
        onPositionEval: (i, e) => { le[i] = e; setEvals([...le]); },
        onComplete: (am, wA, bA, wAcc, bAcc) => {
          setMoves(am); setWhiteACPL(wA); setBlackACPL(bA); setWhiteAccuracy(wAcc); setBlackAccuracy(bAcc);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); setCurrentMoveIndex(prev => Math.max(0, prev - 1)); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setCurrentMoveIndex(prev => Math.min(total - 1, prev + 1)); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  const calcRating = (accuracy: number, blunders: number, mistakes: number) => {
    const baseRating = 400 + accuracy * 1700;
    const blunderPenalty = blunders * 30;
    const mistakePenalty = mistakes * 8;
    return Math.max(800, Math.min(3000, Math.round(baseRating - blunderPenalty - mistakePenalty)));
  };
  const whiteRating = calcRating(whiteAccuracy, wb, wm);
  const blackRating = calcRating(blackAccuracy, bb, bm);

  const curEval = evals[currentMoveIndex];
  const rawEvalCp = curEval?.eval ?? 0;
  const evalCp = flipped ? -rawEvalCp : rawEvalCp;
  const isMate = Math.abs(evalCp) > 29000;
  const evalDisplay = isMate ? 'MATE' : (evalCp > 0 ? '+' : '') + (evalCp / 100).toFixed(1);
  const evalSide = evalCp > 0 ? (flipped ? 'Black' : 'White') : evalCp < 0 ? (flipped ? 'White' : 'Black') : 'Equal';

  const curMove = currentMoveIndex < total
    ? moves[Math.floor(currentMoveIndex / 2)]?.[currentMoveIndex % 2 === 0 ? 'white' : 'black']
    : null;

  const reset = () => { setPgn(''); setMoves([]); setEvals([]); setCurrentMoveIndex(0); setGameInfo(null); setFlipped(false); setProgress({ current: 0, total: 0, status: 'idle', currentMove: '' }); };

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        {!pgn && (
          <div>
            <div className="text-center mb-10">
              <span className="tag tag-gold mb-4 inline-block">Analyzer</span>
              <h1 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: 'Instrument Serif' }}>Analyze a Game</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Upload a PGN or import from Lichess / Chess.com</p>
            </div>
            <div className="max-w-2xl mx-auto px-2 mb-6">
              <button onClick={() => setImportMode(!importMode)} className="btn-secondary w-full">
                {importMode ? '← Back to Paste' : 'Import from Lichess / Chess.com'}
              </button>
            </div>
            {importMode ? (
              <div className="max-w-2xl mx-auto">
                <ImportGame onGameSelect={(pgn) => { setImportMode(false); handlePgnSubmit(pgn); }} />
              </div>
            ) : (
              <PgnUpload onPgnSubmit={handlePgnSubmit} />
            )}
            {savedGames.length > 0 && (
              <div className="mt-12 max-w-2xl mx-auto">
                <div className="section-divider mb-6" />
                <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Inter' }}>Recent Games</h2>
                <div className="space-y-2">
                  {savedGames.slice(0, 5).map((g) => (
                    <div key={g.id} className="surface surface-hover p-3 flex justify-between items-center cursor-pointer" onClick={() => {
                      setPgn(''); setGameInfo({ white: g.whiteName, black: g.blackName, result: g.result });
                      setMoves(g.moves); setWhiteACPL(g.whiteACPL); setBlackACPL(g.blackACPL);
                      setProgress({ current: g.totalMoves, total: g.totalMoves, status: 'done', currentMove: '' });
                    }}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{g.whiteName}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>vs</span>
                        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{g.blackName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="mono text-xs" style={{ color: 'var(--text-muted)' }}>{g.whiteACPL}/{g.blackACPL}</span>
                        <button onClick={(e) => { e.stopPropagation(); deleteGame(g.id).then(() => getAllGames().then(setSavedGames).catch(() => {})); }} className="text-xs opacity-40 hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }}>×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {progress.status !== 'idle' && <div className="mb-4"><AnalysisProgress {...progress} /></div>}

        {moves.length > 0 && (
          <div>
            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {[
                { v: `${Math.round(whiteAccuracy * 100)}%`, l: `${gameInfo?.white || 'W'} Accuracy` },
                { v: `${Math.round(blackAccuracy * 100)}%`, l: `${gameInfo?.black || 'B'} Accuracy` },
                { v: `${wb}/${bb}`, l: 'Blunders', c: 'var(--accent-red)' },
                { v: `${wm}/${bm}`, l: 'Mistakes', c: 'var(--accent-amber)' },
                { v: `${whiteRating}/${blackRating}`, l: 'Est. Rating', c: 'var(--gold)' },
              ].map((s) => (
                <div key={s.l} className="surface p-3 text-center">
                  <div className="text-lg font-bold" style={{ fontFamily: 'Inter', color: s.c || 'var(--text)' }}>{s.v}</div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
              {/* Left: Board + Eval */}
              <div className="lg:col-span-5 space-y-3 min-w-0">
                <div className="surface p-3 overflow-hidden">
                  <div className="flex gap-3 min-w-0">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <span className="mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{evalSide}</span>
                      <div className="w-5 h-64 md:h-80 rounded overflow-hidden relative" style={{ background: 'var(--bg-subtle)' }}>
                        <div className="absolute bottom-0 left-0 right-0 rounded transition-all duration-300" style={{
                          height: isMate ? (evalCp > 0 ? '100%' : '5%') : `${Math.min(95, Math.max(5, 50 + (evalCp / 100) * 2))}%`,
                          background: evalCp >= 0 ? 'var(--text)' : '#27272a',
                        }} />
                      </div>
                      <span className="mono text-[11px] font-semibold" style={{ color: evalCp >= 0 ? 'var(--text)' : 'var(--text-muted)' }}>
                        {evalDisplay}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <ChessBoard pgn={pgn} currentMoveIndex={currentMoveIndex} orientation={flipped ? 'black' : 'white'} whiteName={gameInfo?.white} blackName={gameInfo?.black} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <button onClick={() => setCurrentMoveIndex(prev => Math.max(0, prev - 1))} disabled={currentMoveIndex === 0}
                      className="btn-ghost btn-sm disabled:opacity-30">← Prev</button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setFlipped(!flipped)} className="btn-ghost btn-sm">↻</button>
                      <span className="mono text-xs" style={{ color: 'var(--text-muted)' }}>{currentMoveIndex + 1}/{total}</span>
                    </div>
                    <button onClick={() => setCurrentMoveIndex(prev => Math.min(total - 1, prev + 1))} disabled={currentMoveIndex >= total - 1}
                      className="btn-ghost btn-sm disabled:opacity-30">Next →</button>
                  </div>
                </div>
                <div className="surface p-3">
                  <EvalGraph evals={evals} currentMoveIndex={currentMoveIndex} onMoveClick={setCurrentMoveIndex} flipped={flipped} />
                </div>
              </div>

              {/* Right: Move info + list */}
              <div className="lg:col-span-7 space-y-3">
                {curMove && (
                  <div className="surface p-4" key={currentMoveIndex} style={{ animation: 'fadeIn 0.2s ease' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="mono text-sm font-semibold" style={{ color: 'var(--text)' }}>
                          {Math.floor(currentMoveIndex / 2) + 1}.{currentMoveIndex % 2 === 0 ? '' : '...'}{curMove.san}
                        </span>
                        <span className={`badge-${curMove.classification}`}>{curMove.classification}</span>
                      </div>
                      <span className="mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        {evalDisplay}
                      </span>
                    </div>
                    {curMove.bestMove && (
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Best: <span className="mono" style={{ color: 'var(--gold)' }}>{curMove.bestMove}</span>
                        {curMove.evalLoss > 0 && <> · Lost {curMove.evalLoss}cp</>}
                      </p>
                    )}
                    {curMove.classification !== 'excellent' && curMove.classification !== 'best' && (
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {curMove.classification === 'blunder' && `This move loses significant advantage. The engine prefers ${curMove.bestMove || 'a different move'}.`}
                        {curMove.classification === 'mistake' && `This move weakens the position. Better alternatives exist.`}
                        {curMove.classification === 'inaccuracy' && `Slightly inaccurate — a more precise move was available.`}
                        {curMove.classification === 'good' && `Decent move, but not the engine's top choice.`}
                      </p>
                    )}
                    {curMove.pv.length > 2 && (
                      <div className="mt-2 mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        Engine: {curMove.pv.slice(0, 6).map((m, i) => <span key={i} className="hover:text-[var(--gold)] cursor-pointer">{m} </span>)}...
                      </div>
                    )}
                  </div>
                )}
                <div className="surface overflow-hidden">
                  <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
                    {(['moves', 'details'] as const).map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className="flex-1 py-2.5 text-sm font-medium transition-colors" style={{ color: activeTab === tab ? 'var(--gold)' : 'var(--text-muted)', borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent' }}>
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
                          <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'Inter' }}>{gameInfo?.white || 'White'}</h4>
                          <div className="w-full rounded-full h-2" style={{ background: 'var(--bg-subtle)' }}><div className="h-2 rounded-full" style={{ width: `${Math.round(whiteAccuracy * 100)}%`, background: 'var(--accent-green)' }} /></div>
                          <p className="mono text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{Math.round(whiteAccuracy * 100)}% ({wbe}/{total / 2} best/excellent)</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'Inter' }}>{gameInfo?.black || 'Black'}</h4>
                          <div className="w-full rounded-full h-2" style={{ background: 'var(--bg-subtle)' }}><div className="h-2 rounded-full" style={{ width: `${Math.round(blackAccuracy * 100)}%`, background: 'var(--accent-green)' }} /></div>
                          <p className="mono text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{Math.round(blackAccuracy * 100)}% ({bbe}/{total / 2} best/excellent)</p>
                        </div>
                        <div className="section-divider" />
                        <div>
                          <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'Inter' }}>Move Breakdown</h4>
                          <div className="space-y-1.5 text-xs">
                            {[
                              ['Best', moves.filter(m => m.white?.classification === 'best').length, moves.filter(m => m.black?.classification === 'best').length, 'var(--accent-green)'],
                              ['Excellent', moves.filter(m => m.white?.classification === 'excellent').length, moves.filter(m => m.black?.classification === 'excellent').length, 'var(--accent-green)'],
                              ['Good', moves.filter(m => m.white?.classification === 'good').length, moves.filter(m => m.black?.classification === 'good').length, 'var(--text-secondary)'],
                              ['Inaccuracy', wi, bi, 'var(--accent-amber)'],
                              ['Mistake', wm, bm, '#f87171'],
                              ['Blunder', wb, bb, 'var(--accent-red)'],
                            ].map(([label, wCount, bCount, c]) => (
                              <div key={label as string} className="flex justify-between items-center">
                                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                                <span className="mono" style={{ color: c as string }}>{wCount} / {bCount}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>White / Black</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button onClick={reset} className="btn-secondary">Analyze Another Game</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
