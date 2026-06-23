import { PositionEval, AnalyzedMove, AnalyzedMoveData } from '@/types';
import { classifyMove } from '@/lib/classification';
import { Chess } from 'chess.js';

export interface PgnParseResult {
  positions: string[];
  moves: string[];
  sanMoves: string[];
  result: string;
  whiteName: string;
  blackName: string;
}

export function parsePgnToPositions(pgn: string): PgnParseResult {
  const whiteMatch = pgn.match(/\[White\s+"([^"]*)"\]/);
  const blackMatch = pgn.match(/\[Black\s+"([^"]*)"\]/);
  const resultMatch = pgn.match(/\[Result\s+"([^"]*)"\]/);

  const chess = new Chess();
  try {
    chess.loadPgn(pgn);
  } catch {
    try {
      const movesOnly = pgn.replace(/\[.*?\]/g, '').replace(/\{.*?\}/g, '').trim();
      chess.reset();
      chess.loadPgn(movesOnly);
    } catch {}
  }

  const history = chess.history({ verbose: true });
  const positions: string[] = [];
  const moves: string[] = [];
  const sanMoves: string[] = [];

  const replay = new Chess();
  positions.push(replay.fen());

  for (const move of history) {
    moves.push(move.from + move.to + (move.promotion || ''));
    sanMoves.push(move.san);
    replay.move(move.san);
    positions.push(replay.fen());
  }

  return {
    positions,
    moves,
    sanMoves,
    result: resultMatch?.[1] || '*',
    whiteName: whiteMatch?.[1] || 'White',
    blackName: blackMatch?.[1] || 'Black',
  };
}

export function buildAnalysisResult(
  evals: PositionEval[],
  sanMoves: string[],
  uciMoves: string[]
): AnalyzedMove[] {
  const analyzedMoves: AnalyzedMove[] = [];

  for (let i = 0; i < sanMoves.length; i++) {
    const moveNum = Math.floor(i / 2) + 1;
    const isBlack = i % 2 === 1;

    const evalBefore = evals[i]?.eval ?? 0;
    const evalAfter = evals[i + 1]?.eval ?? 0;
    const classification = classifyMove(evalBefore, evalAfter, isBlack);

    const eb = isBlack ? -evalBefore : evalBefore;
    const ea = isBlack ? -evalAfter : evalAfter;
    const evalLoss = Math.max(0, eb - ea);

    const moveData: AnalyzedMoveData = {
      san: sanMoves[i],
      uci: '',
      classification,
      evalBefore,
      evalAfter,
      evalLoss,
      bestMove: evals[i]?.bestMove ?? '',
      pv: evals[i]?.pv ?? [],
    };

    if (isBlack) {
      const last = analyzedMoves[analyzedMoves.length - 1];
      if (last) last.black = moveData;
    } else {
      analyzedMoves.push({ moveNumber: moveNum, white: moveData });
    }
  }

  return analyzedMoves;
}

export interface AnalysisCallbacks {
  onProgress: (current: number, total: number, move: string) => void;
  onPositionEval: (index: number, eval_: PositionEval) => void;
  onComplete: (moves: AnalyzedMove[], whiteACPL: number, blackACPL: number) => void;
  onError: (error: string) => void;
}

function analyzePositionWorker(
  worker: Worker,
  fen: string,
  depth: number
): Promise<PositionEval> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout')), 60000);
    let lastEval = 0;
    let lastPV: string[] = [];
    let lastBestMove = '';

    const handler = (e: MessageEvent) => {
      if (e.data.type === 'info') {
        const line = e.data.payload;
        const cpMatch = line.match(/score cp (-?\d+)/);
        const mateMatch = line.match(/score mate (-?\d+)/);
        if (cpMatch) lastEval = parseInt(cpMatch[1]);
        else if (mateMatch) {
          const m = parseInt(mateMatch[1]);
          lastEval = m > 0 ? 30000 - m * 2 : -30000 - Math.abs(m) * 2;
        }
        const pvMatch = line.match(/pv (.+)/);
        if (pvMatch) lastPV = pvMatch[1].split(' ');
      }
      if (e.data.type === 'bestmove') {
        clearTimeout(timeout);
        worker.removeEventListener('message', handler);
        lastBestMove = e.data.payload.split(' ')[1] || '';

        // Stockfish returns eval from side-to-move perspective.
        // Convert to always be from white's perspective.
        const turn = fen.split(' ')[1]; // 'w' or 'b'
        const whitePerspectiveEval = turn === 'w' ? lastEval : -lastEval;

        resolve({
          fen,
          eval: whitePerspectiveEval,
          bestMove: lastBestMove,
          pv: lastPV,
          depth
        });
      }
    };

    worker.addEventListener('message', handler);
    worker.postMessage({ type: 'command', payload: `position fen ${fen}` });
    worker.postMessage({ type: 'command', payload: `go depth ${depth}` });
  });
}

const NUM_WORKERS = 2;
const DISPLAY_DELAY_MS = 310;

function createWorkerPool(): Worker[] {
  const workers: Worker[] = [];
  for (let i = 0; i < NUM_WORKERS; i++) {
    const w = new Worker('/stockfish-worker.js');
    workers.push(w);
  }
  return workers;
}

async function initWorkers(workers: Worker[]): Promise<void> {
  for (let i = 0; i < workers.length; i++) {
    workers[i].postMessage({ type: 'init' });
    if (i < workers.length - 1) await new Promise(r => setTimeout(r, 50));
  }
  await Promise.all(workers.map(w => waitForReady(w, 10000)));
}

function waitForReady(worker: Worker, timeoutMs = 5000): Promise<void> {
  return new Promise((resolve) => {
    const handler = (e: MessageEvent) => {
      if (e.data.type === 'ready') {
        worker.removeEventListener('message', handler);
        resolve();
      }
    };
    worker.addEventListener('message', handler);
    setTimeout(() => { worker.removeEventListener('message', handler); resolve(); }, timeoutMs);
  });
}

export async function analyzeGame(
  positions: string[],
  sanMoves: string[],
  uciMoves: string[],
  _singleWorker: Worker,
  depth: number,
  callbacks: AnalysisCallbacks
): Promise<void> {
  const evals: PositionEval[] = new Array(positions.length);

  const terminal = new Set<number>();
  for (let i = 0; i < positions.length; i++) {
    const b = new Chess();
    try { b.load(positions[i]); } catch {}
    if (b.isGameOver()) terminal.add(i);
  }

  const workers = createWorkerPool();
  await initWorkers(workers);

  let completed = 0;
  const total = positions.length;

  const indices = Array.from({ length: positions.length }, (_, i) => i);
  let nextIndex = 0;

  const processNext = async (workerIdx: number) => {
    while (nextIndex < indices.length) {
      const i = indices[nextIndex++];

      if (terminal.has(i)) {
        const fallback = evals[Math.max(0, i - 1)] ?? { fen: positions[i], eval: 0, bestMove: '', pv: [], depth };
        evals[i] = { ...fallback, fen: positions[i] };
        completed++;
        callbacks.onProgress(completed, total, i === 0 ? 'Starting position' : sanMoves[i - 1]);
        callbacks.onPositionEval(i, evals[i]);
        continue;
      }

      try {
        evals[i] = await analyzePositionWorker(workers[workerIdx], positions[i], depth);
      } catch {
        const fallback = evals[Math.max(0, i - 1)] ?? { fen: positions[i], eval: 0, bestMove: '', pv: [], depth };
        evals[i] = { ...fallback, fen: positions[i] };
      }

      completed++;
      callbacks.onProgress(completed, total, i === 0 ? 'Starting position' : sanMoves[i - 1]);
      callbacks.onPositionEval(i, evals[i]);
    }
  };

  await Promise.all(workers.map((_, idx) => processNext(idx)));
  workers.forEach(w => w.terminate());

  try {
    const analyzedMoves = buildAnalysisResult(evals, sanMoves, uciMoves);
    const allEvalLosses = analyzedMoves.flatMap(m => {
      const entries = [];
      if (m.white) entries.push({ evalLoss: m.white.evalLoss, isBlack: false });
      if (m.black) entries.push({ evalLoss: m.black.evalLoss, isBlack: true });
      return entries;
    });
    const { calculateACPL } = await import('@/lib/acpl');
    const whiteACPL = calculateACPL(allEvalLosses, false);
    const blackACPL = calculateACPL(allEvalLosses, true);
    callbacks.onComplete(analyzedMoves, whiteACPL, blackACPL);
  } catch {
    callbacks.onError('Failed to build results');
  }
}
