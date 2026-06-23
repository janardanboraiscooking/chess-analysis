// Stockfish Web Worker — loaded from public folder
// Uses importScripts to load stockfish.wasm.js at runtime

let engine = null;

self.onmessage = function(e) {
  var data = e.data;

  if (data.type === 'init') {
    try {
      importScripts('/stockfish/stockfish.wasm.js');
      engine = self.Stockfish();
      engine.onmessage = function(line) {
        if (line === 'uciok') {
          self.postMessage({ type: 'ready' });
        } else if (line.indexOf('info depth') === 0) {
          self.postMessage({ type: 'info', payload: line });
        } else if (line.indexOf('bestmove') === 0) {
          self.postMessage({ type: 'bestmove', payload: line });
        }
      };
    } catch (err) {
      self.postMessage({ type: 'error', payload: String(err) });
    }
  }

  if (data.type === 'command' && engine) {
    engine.postMessage(data.payload);
  }
};
