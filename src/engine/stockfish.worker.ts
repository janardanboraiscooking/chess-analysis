// Stockfish Web Worker
// Loads stockfish.js from public folder to avoid Node.js 'fs' issue

let engine: any = null;

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'init') {
    // Import the WASM loader from public
    import('/stockfish/stockfish.wasm.js').then((module) => {
      const Stockfish = module.default || module.Stockfish;
      engine = Stockfish();
      engine.onmessage = (line: string) => {
        if (line === 'uciok') {
          self.postMessage({ type: 'ready' });
        } else if (line.startsWith('info depth')) {
          self.postMessage({ type: 'info', payload: line });
        } else if (line.startsWith('bestmove')) {
          self.postMessage({ type: 'bestmove', payload: line });
        }
      };
    }).catch((err) => {
      console.error('Failed to load Stockfish:', err);
      self.postMessage({ type: 'error', payload: err.message });
    });
  }

  if (type === 'command' && engine) {
    engine.postMessage(payload);
  }
};
