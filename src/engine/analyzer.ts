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

function getLichessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lichess_token');
}

export function setLichessToken(token: string): void {
  localStorage.setItem('lichess_token', token);
}

export function clearLichessToken(): void {
  localStorage.removeItem('lichess_token');
}

export function hasLichessToken(): boolean {
  return !!getLichessToken();
}

async function fetchLichessEval(fen: string): Promise<PositionEval | null> {
  try {
    const token = getLichessToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(
      `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}&multiPv=1`,
      { headers }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.pvs?.length) return null;

    const pv = data.pvs[0];
    let evalCp = 0;
    if (pv.cp !== undefined) evalCp = pv.cp;
    else if (pv.mate !== undefined) evalCp = pv.mate > 0 ? 30000 - pv.mate * 2 : -30000 - Math.abs(pv.mate) * 2;

    return {
      fen,
      eval: evalCp,
      bestMove: pv.moves?.split(' ')[0] ?? '',
      pv: pv.moves?.split(' ') ?? [],
      depth: data.depth ?? 20,
    };
  } catch {
    return null;
  }
}

async function analyzePositionApi(fen: string, depth: number): Promise<PositionEval> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen, depth }),
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return {
      fen,
      eval: data.eval ?? 0,
      bestMove: data.bestMove ?? '',
      pv: data.pv ?? [],
      depth: data.depth ?? depth,
    };
  } catch {
    throw new Error('API failed');
  }
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

  // Detect terminal positions
  const terminal = new Set<number>();
  for (let i = 0; i < positions.length; i++) {
    const b = new Chess();
    try { b.load(positions[i]); } catch {}
    if (b.isGameOver()) terminal.add(i);
  }

  let completed = 0;
  const total = positions.length;

  // Analyze all positions via API (server-side Stockfish)
  for (let i = 0; i < positions.length; i++) {
    callbacks.onProgress(completed, total, i === 0 ? 'Starting position' : sanMoves[i - 1]);

    if (terminal.has(i)) {
      const fallback = evals[Math.max(0, i - 1)] ?? { fen: positions[i], eval: 0, bestMove: '', pv: [], depth };
      evals[i] = { ...fallback, fen: positions[i] };
      completed++;
      callbacks.onPositionEval(i, evals[i]);
      continue;
    }

    try {
      evals[i] = await analyzePositionApi(positions[i], depth);
    } catch {
      const fallback = evals[Math.max(0, i - 1)] ?? { fen: positions[i], eval: 0, bestMove: '', pv: [], depth };
      evals[i] = { ...fallback, fen: positions[i] };
    }

    completed++;
    callbacks.onProgress(completed, total, i === 0 ? 'Starting position' : sanMoves[i - 1]);
    callbacks.onPositionEval(i, evals[i]);
  }

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
