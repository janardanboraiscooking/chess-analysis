// Stockfish Web Worker — uses CDN-hosted stockfish.js (asm.js, no WASM)

// Intercept postMessage BEFORE loading stockfish.js
// so we can catch its raw UCI string output
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

// Now load stockfish.js — it will set self.onmessage for UCI
importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');

// Save stockfish.js's onmessage handler
var _stockfishHandler = self.onmessage;

// Replace with our handler that routes commands to stockfish.js
self.onmessage = function(e) {
  var data = e.data;
  if (data.type === 'command' && _stockfishHandler) {
    _stockfishHandler({ data: data.payload });
  }
};
