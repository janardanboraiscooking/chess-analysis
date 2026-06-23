// Stockfish Web Worker — loads from CDN
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

importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');

var _sfHandler = self.onmessage;

self.onmessage = function(e) {
  if (e.data.type === 'command' && _sfHandler) {
    _sfHandler({ data: e.data.payload });
  }
};

if (_sfHandler) {
  _sfHandler({ data: 'uci' });
}
