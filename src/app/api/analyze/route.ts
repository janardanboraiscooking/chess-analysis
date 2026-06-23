import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { fen, depth } = await req.json();

    if (!fen || typeof fen !== 'string') {
      return NextResponse.json({ error: 'Invalid FEN' }, { status: 400 });
    }

    const d = Math.min(depth || 12, 20);

    // Use stockfish npm package (WASM-based)
    const Stockfish = await import('stockfish');
    const engine = Stockfish.default();

    const result = await new Promise<{ eval: number; bestMove: string; pv: string[] }>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout')), 8000);
      let evalCp = 0;
      let bestMove = '';
      let pv: string[] = [];

      engine.onmessage = (line: string) => {
        if (line.startsWith('info depth')) {
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
        if (line.startsWith('bestmove')) {
          clearTimeout(timeout);
          bestMove = line.split(' ')[1] || '';
          resolve({ eval: evalCp, bestMove, pv });
        }
      };

      engine.postMessage('uci');
      engine.postMessage(`position fen ${fen}`);
      engine.postMessage(`go depth ${d}`);
    });

    return NextResponse.json({ ...result, depth: d });
  } catch (err) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
