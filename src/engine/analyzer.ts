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
    whiteName: whiteMatch?.[1] || '',
    blackName: blackMatch?.[1] || '',
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
    const playerUci = uciMoves[i] ?? '';
    const bestMove = evals[i]?.bestMove ?? '';
    const classification = classifyMove(evalBefore, evalAfter, isBlack, playerUci, bestMove);

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

function analyzePosition(
  worker: Worker,
  fen: string,
  depth: number
): Promise<PositionEval> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout')), 15000);
    let lastEval = 0;
    let lastPV: string[] = [];

    const handler = (e: MessageEvent) => {
      if (e.data.type === 'info') {
        const line = e.data.payload;
        const scoreMatch = line.match(/score cp (-?\d+)/);
        if (scoreMatch) lastEval = parseInt(scoreMatch[1]);
        const pvMatch = line.match(/pv (.+)/);
        if (pvMatch) lastPV = pvMatch[1].split(' ');
      }
      if (e.data.type === 'bestmove') {
        clearTimeout(timeout);
        worker.removeEventListener('message', handler);
        const bestMove = e.data.payload.split(' ')[1];
        resolve({ fen, eval: lastEval, bestMove, pv: lastPV, depth });
      }
    };

    worker.addEventListener('message', handler);
    worker.postMessage({ type: 'command', payload: `position fen ${fen}` });
    worker.postMessage({ type: 'command', payload: `go depth ${depth}` });
  });
}

const NUM_WORKERS = 16;

function createWorkerPool(): Worker[] {
  const workers: Worker[] = [];
  for (let i = 0; i < NUM_WORKERS; i++) {
    const w = new Worker('/stockfish-worker.js');
    w.postMessage({ type: 'init' });
    workers.push(w);
  }
  return workers;
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
    setTimeout(() => {
      worker.removeEventListener('message', handler);
      resolve();
    }, timeoutMs);
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

  // Identify terminal positions (checkmate/stalemate)
  const terminal = new Set<number>();
  for (let i = 0; i < positions.length; i++) {
    const testBoard = new Chess();
    try { testBoard.load(positions[i]); } catch {}
    if (testBoard.isGameOver()) {
      terminal.add(i);
    }
  }

  // Create worker pool and wait for all ready
  const workers = createWorkerPool();
  await Promise.all(workers.map(w => waitForReady(w)));

  let completed = 0;
  const total = positions.length;

  // Process positions in parallel batches
  const indices = Array.from({ length: positions.length }, (_, i) => i);

  await new Promise<void>(async (resolveAll) => {
    let nextIndex = 0;

    const processNext = async (workerIdx: number) => {
      while (nextIndex < indices.length) {
        const i = indices[nextIndex++];

        callbacks.onProgress(completed, total, i === 0 ? 'Starting position' : sanMoves[i - 1]);

        if (terminal.has(i)) {
          const fallback = evals[Math.max(0, i - 1)] ?? { fen: positions[i], eval: 0, bestMove: '', pv: [], depth };
          evals[i] = { ...fallback, fen: positions[i] };
          completed++;
          callbacks.onPositionEval(i, evals[i]);
          continue;
        }

        try {
          const result = await analyzePosition(workers[workerIdx], positions[i], depth);
          evals[i] = result;
        } catch {
          const fallback = evals[Math.max(0, i - 1)] ?? { fen: positions[i], eval: 0, bestMove: '', pv: [], depth };
          evals[i] = { ...fallback, fen: positions[i] };
        }

        completed++;
        callbacks.onProgress(completed, total, i === 0 ? 'Starting position' : sanMoves[i - 1]);
        callbacks.onPositionEval(i, evals[i]);
      }
    };

    // Start all workers
    await Promise.all(workers.map((_, idx) => processNext(idx)));

    // Terminate workers
    workers.forEach(w => w.terminate());

    // Build results
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

    resolveAll();
  });
}
