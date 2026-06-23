// Stockfish Web Worker — loads from local /stockfish/stockfish.js

var _realPostMessage = self.postMessage.bind(self);
var _msgCount = 0;

self.postMessage = function(msg) {
  _msgCount++;
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

try {
  importScripts('/stockfish/stockfish.js');
  _realPostMessage({ type: 'debug', payload: 'stockfish.js loaded successfully' });
} catch (err) {
  _realPostMessage({ type: 'error', payload: 'Failed to load stockfish.js: ' + err.message });
}

var _sfHandler = self.onmessage;

self.onmessage = function(e) {
  if (e.data.type === 'command' && _sfHandler) {
    _sfHandler({ data: e.data.payload });
  }
};

if (_sfHandler) {
  _sfHandler({ data: 'uci' });
}
