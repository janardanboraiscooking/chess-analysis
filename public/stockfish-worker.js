// Stockfish Web Worker — loaded from public folder
// Queues UCI commands until WASM module is ready

var queue = [];
var ready = false;
var origPostMessage = self.postMessage;

// Intercept postMessage to catch stockfish.wasm.js output (raw UCI strings)
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

// Save our onmessage, let stockfish.wasm.js overwrite it, then restore
var savedOnMessage = self.onmessage;

importScripts('/stockfish/stockfish.wasm.js');

// stockfish.wasm.js set its own onmessage on self
// We need to intercept it: queue commands, forward to Module.ccall
var stockfishOnMessage = self.onmessage;

self.onmessage = function(e) {
  var data = e.data;

  if (data.type === 'command') {
    if (typeof Module !== 'undefined' && Module.ccall) {
      Module.ccall("uci_command", "number", ["string"], [data.payload]);
    } else {
      queue.push(data.payload);
    }
  } else if (data.type === 'init') {
    // Check if Module is ready
    if (typeof Module !== 'undefined' && Module.ccall) {
      // Flush queued commands
      for (var i = 0; i < queue.length; i++) {
        Module.ccall("uci_command", "number", ["string"], [queue[i]]);
      }
      queue = [];
      ready = true;
    }
  }
};

// Try to flush immediately in case Module is already ready
if (typeof Module !== 'undefined' && Module.ccall) {
  ready = true;
  for (var i = 0; i < queue.length; i++) {
    Module.ccall("uci_command", "number", ["string"], [queue[i]]);
  }
  queue = [];
}
