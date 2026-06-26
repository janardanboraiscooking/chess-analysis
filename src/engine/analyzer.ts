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
  try { chess.loadPgn(pgn); } catch {
    try { chess.reset(); chess.loadPgn(pgn.replace(/\[.*?\]/g, '').trim()); } catch {}
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

  return { positions, moves, sanMoves, result: resultMatch?.[1] || '*', whiteName: whiteMatch?.[1] || 'White', blackName: blackMatch?.[1] || 'Black' };
}

export function buildAnalysisResult(evals: PositionEval[], sanMoves: string[], uciMoves: string[]): AnalyzedMove[] {
  const analyzedMoves: AnalyzedMove[] = [];
  for (let i = 0; i < sanMoves.length; i++) {
    const isBlack = i % 2 === 1;
    const evalBefore = evals[i]?.eval ?? 0;
    const evalAfter = evals[i + 1]?.eval ?? 0;
    const classification = classifyMove(evalBefore, evalAfter, isBlack, (uciMoves[i] || '').trim(), (evals[i]?.bestMove || '').trim(), evals[i]?.pv);
    const eb = isBlack ? -evalBefore : evalBefore;
    const ea = isBlack ? -evalAfter : evalAfter;
    const evalLoss = Math.max(0, eb - ea);

    const moveData: AnalyzedMoveData = {
      san: sanMoves[i], uci: '', classification, evalBefore, evalAfter, evalLoss,
      bestMove: evals[i]?.bestMove ?? '', pv: evals[i]?.pv ?? [],
    };

    if (isBlack) {
      const last = analyzedMoves[analyzedMoves.length - 1];
      if (last) last.black = moveData;
    } else {
      analyzedMoves.push({ moveNumber: Math.floor(i / 2) + 1, white: moveData });
    }
  }
  return analyzedMoves;
}

export interface AnalysisCallbacks {
  onProgress: (current: number, total: number, move: string) => void;
  onPositionEval: (index: number, eval_: PositionEval) => void;
  onComplete: (moves: AnalyzedMove[], whiteACPL: number, blackACPL: number, whiteAccuracy: number, blackAccuracy: number) => void;
  onError: (error: string) => void;
}

// Parse Stockfish output to extract eval and best move
function parseStockfishOutput(lines: string[]): { eval: number; bestMove: string; pv: string[] } {
  let evalCp = 0;
  let bestMove = '';
  let pv: string[] = [];

  for (const line of lines) {
    // Parse "info depth N score cp M" or "info depth N score mate M"
    if (line.indexOf('info') === 0) {
      const cpMatch = line.match(/score cp (-?\d+)/);
      const mateMatch = line.match(/score mate (-?\d+)/);
      if (cpMatch) evalCp = parseInt(cpMatch[1]);
      else if (mateMatch) {
        const m = parseInt(mateMatch[1]);
        evalCp = m > 0 ? 30000 - m * 2 : -30000 - Math.abs(m) * 2;
      }
      const pvMatch = line.match(/pv (.+)/);
      if (pvMatch) pv = pvMatch[1].split(' ');
    }
    // Parse "bestmove X"
    if (line.indexOf('bestmove') === 0) {
      bestMove = (line.split(' ')[1] || '').trim();
    }
  }

  return { eval: evalCp, bestMove, pv };
}

function createWorkerPool(): Worker[] {
  const workers: Worker[] = [];
  for (let i = 0; i < 5; i++) {
    workers.push(new Worker('/stockfish-worker.js'));
  }
  return workers;
}

async function initWorkers(workers: Worker[]): Promise<void> {
  for (let i = 0; i < workers.length; i++) {
    workers[i].postMessage({ type: 'init' });
    if (i < workers.length - 1) await new Promise(r => setTimeout(r, 100));
  }
  await Promise.all(workers.map(w => waitForReady(w, 15000)));
}

function waitForReady(worker: Worker, timeoutMs = 5000): Promise<void> {
  return new Promise((resolve) => {
    const handler = (e: MessageEvent) => {
      if (e.data.type === 'ready') { worker.removeEventListener('message', handler); resolve(); }
    };
    worker.addEventListener('message', handler);
    setTimeout(() => { worker.removeEventListener('message', handler); resolve(); }, timeoutMs);
  });
}

// Analyze one position using local Stockfish worker
function analyzeWithWorker(worker: Worker, fen: string, depth: number): Promise<PositionEval> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout')), 30000);
    const rawLines: string[] = [];

    const handler = (e: MessageEvent) => {
      // Collect ALL raw output from Stockfish
      if (e.data.type === 'sf_output') {
        rawLines.push(e.data.payload);
      }
      // When bestmove arrives, parse everything
      if (e.data.type === 'bestmove') {
        clearTimeout(timeout);
        worker.removeEventListener('message', handler);

        // Also add the bestmove line to raw lines for parsing
        rawLines.push(e.data.payload);

        const parsed = parseStockfishOutput(rawLines);
        // Convert from side-to-move perspective to white's perspective
        const evalCp = fen.includes(' b ') ? -parsed.eval : parsed.eval;
        resolve({ fen, eval: evalCp, bestMove: parsed.bestMove, pv: parsed.pv, depth });
      }
    };

    worker.addEventListener('message', handler);
    worker.postMessage({ type: 'command', payload: `position fen ${fen}` });
    worker.postMessage({ type: 'command', payload: `go depth ${depth}` });
  });
}

// Eval conversion: engines return from side-to-move perspective
function negateIfNeeded(fen: string, evalCp: number): number {
  return fen.includes(' b ') ? -evalCp : evalCp;
}

// Cloud API — concurrent pool (3 parallel requests, no rate limit on chess-api.com)
const CLOUD_CONCURRENCY = 5;
let cloudActive = 0;
let cloudWaiting: (() => void)[] = [];

function acquireCloudSlot(): Promise<void> {
  if (cloudActive < CLOUD_CONCURRENCY) { cloudActive++; return Promise.resolve(); }
  return new Promise(resolve => cloudWaiting.push(resolve));
}

function releaseCloudSlot() {
  cloudActive--;
  if (cloudWaiting.length > 0) { cloudActive++; cloudWaiting.shift()!(); }
}

// chess-api.com — free, depth 18, no rate limit, returns eval + PV + win chance
function analyzeWithChessApi(fen: string): Promise<PositionEval | null> {
  return new Promise(async (resolve) => {
    await acquireCloudSlot();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('https://chess-api.com/v1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fen, depth: 24 }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) { resolve(null); return; }
      const data = await res.json();
      if (data.type === 'error') { resolve(null); return; }
      let evalCp = 0;
      const debugMatch = data.debug?.match(/score (?:cp|mate) (-?\d+)/);
      if (debugMatch) {
        const rawScore = parseInt(debugMatch[1]);
        evalCp = data.turn === 'b' ? -rawScore : rawScore;
      }
      const pvMoves = data.continuationArr || [];
      const bestMove = data.move || pvMoves[0] || '';
      resolve({ fen, eval: evalCp, bestMove, pv: pvMoves, depth: data.depth || 18 });
    } catch {
      resolve(null);
    } finally {
      releaseCloudSlot();
    }
  });
}

// Stockfish.online — free, depth 15, fallback
// Returns eval in pawns from White's perspective (positive = White better)
function analyzeWithStockfishOnline(fen: string): Promise<PositionEval | null> {
  return new Promise(async (resolve) => {
    await acquireCloudSlot();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const encoded = encodeURIComponent(fen);
      const res = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encoded}&depth=15`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) { resolve(null); return; }
      const data = await res.json();
      if (!data.success) { resolve(null); return; }
      const evalCp = data.mate
        ? (data.mate > 0 ? 30000 - data.mate * 2 : -30000 - Math.abs(data.mate) * 2)
        : Math.round(data.evaluation * 100);
      const pvMoves = data.continuation?.split(' ') || [];
      const bestMove = pvMoves[0] || data.bestmove?.split(' ')[1] || '';
      resolve({ fen, eval: evalCp, bestMove, pv: pvMoves, depth: 15 });
    } catch {
      resolve(null);
    } finally {
      releaseCloudSlot();
    }
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
        // Tier 1: chess-api.com (depth 18, no rate limit)
        const chessApi = await analyzeWithChessApi(positions[i]);
        if (chessApi) {
          evals[i] = chessApi;
        } else {
          // Tier 2: Stockfish.online (depth 15)
          const online = await analyzeWithStockfishOnline(positions[i]);
          if (online) {
            evals[i] = online;
          } else {
            // Tier 3: Local Stockfish (depth 16)
            evals[i] = await analyzeWithWorker(workers[workerIdx], positions[i], depth);
          }
        }
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
    const allMoves = analyzedMoves.flatMap(m => {
      const entries = [];
      if (m.white) entries.push({ classification: m.white.classification, isBlack: false });
      if (m.black) entries.push({ classification: m.black.classification, isBlack: true });
      return entries;
    });
    const { calculateACPL, calculateAccuracy } = await import('@/lib/acpl');
    const whiteACPL = calculateACPL(allEvalLosses, false);
    const blackACPL = calculateACPL(allEvalLosses, true);
    const whiteAccuracy = calculateAccuracy(allMoves, false);
    const blackAccuracy = calculateAccuracy(allMoves, true);
    callbacks.onComplete(analyzedMoves, whiteACPL, blackACPL, whiteAccuracy, blackAccuracy);
  } catch {
    callbacks.onError('Failed to build results');
  }
}
