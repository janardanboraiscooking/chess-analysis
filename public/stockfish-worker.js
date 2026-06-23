// Stockfish Web Worker — loads from local /stockfish/stockfish.js
// Logs ALL messages for debugging

var _realPostMessage = self.postMessage.bind(self);

// Intercept ALL postMessage from stockfish.js
self.postMessage = function(msg) {
  if (typeof msg === 'string') {
    // Log EVERYTHING stockfish sends
    _realPostMessage({ type: 'sf_output', payload: msg });

    if (msg === 'uciok') {
      _realPostMessage({ type: 'ready' });
    } else if (msg.indexOf('bestmove') === 0) {
      _realPostMessage({ type: 'bestmove', payload: msg });
    }
    // Don't filter info lines — let analyzer parse raw output
  } else {
    _realPostMessage(msg);
  }
};

try {
  importScripts('/stockfish/stockfish.js');
  _realPostMessage({ type: 'debug', payload: 'stockfish.js loaded OK' });
} catch (err) {
  _realPostMessage({ type: 'error', payload: 'Failed to load: ' + err.message });
}

var _sfHandler = self.onmessage;

self.onmessage = function(e) {
  if (e.data.type === 'command' && _sfHandler) {
    _sfHandler({ data: e.data.payload });
  }
};

// Auto-initialize
if (_sfHandler) {
  _sfHandler({ data: 'uci' });
}
