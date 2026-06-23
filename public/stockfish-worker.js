// Stockfish Web Worker — WASM via CDN for speed

var _realPostMessage = self.postMessage.bind(self);
self.postMessage = function(msg) {
  if (typeof msg === 'string') {
    if (msg === 'uciok') {
      _realPostMessage({ type: 'ready' });
    } else if (msg.indexOf('info depth') === 0) {
      _realPostMessage({ type: 'info', payload: msg });
    } else if (msg.indexOf('bestmove') === 0) {
      _realPostMessage({ type: 'bestmove', payload: msg });
    }
  } else {
    _realPostMessage(msg);
  }
};

// Load asm.js stockfish (reliable, fast enough at low depth)
importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');

var _stockfishHandler = self.onmessage;

self.onmessage = function(e) {
  var data = e.data;
  if (data.type === 'command' && _stockfishHandler) {
    _stockfishHandler({ data: data.payload });
  }
};

// Auto-initialize
if (_stockfishHandler) {
  _stockfishHandler({ data: 'uci' });
}
