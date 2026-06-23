// Stockfish Web Worker — uses CDN-hosted stockfish.js (asm.js, no WASM)

var queue = [];
var ready = false;

// Load stockfish.js from CDN
importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');

// stockfish.js sets self.onmessage for UCI protocol
// We need to intercept its output (raw strings via postMessage)
var origPostMessage = self.postMessage;
self.postMessage = function(msg) {
  if (typeof msg === 'string') {
    if (msg === 'uciok') {
      origPostMessage({ type: 'ready' });
    } else if (msg.indexOf('info depth') === 0) {
      origPostMessage({ type: 'info', payload: msg });
    } else if (msg.indexOf('bestmove') === 0) {
      origPostMessage({ type: 'bestmove', payload: msg });
    }
  } else {
    origPostMessage(msg);
  }
};

// Override onmessage to handle our protocol
// stockfish.js already set its own onmessage for raw UCI strings
// We need to route our structured messages to it
var stockfishHandler = self.onmessage;

self.onmessage = function(e) {
  var data = e.data;

  if (data.type === 'command') {
    // Forward UCI command to stockfish.js
    if (stockfishHandler) {
      stockfishHandler({ data: data.payload });
    } else {
      queue.push(data.payload);
    }
  }
};

ready = true;
