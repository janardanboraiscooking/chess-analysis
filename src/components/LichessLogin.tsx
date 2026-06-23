'use client';
import { useState } from 'react';
import { setLichessToken, clearLichessToken, hasLichessToken } from '@/engine/analyzer';

interface LichessLoginProps {
  onTokenChange: () => void;
}

export default function LichessLogin({ onTokenChange }: LichessLoginProps) {
  const [token, setToken] = useState('');
  const [loggedIn, setLoggedIn] = useState(hasLichessToken());

  const handleLogin = () => {
    if (token.trim()) {
      setLichessToken(token.trim());
      setLoggedIn(true);
      setToken('');
      onTokenChange();
    }
  };

  const handleLogout = () => {
    clearLichessToken();
    setLoggedIn(false);
    onTokenChange();
  };

  if (loggedIn) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-green-400">✓ Lichess connected</span>
        <span className="text-gray-500">(10 req/sec)</span>
        <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <p className="text-sm text-gray-400 mb-2">
        Paste a <a href="https://lichess.org/account/oauth/token" target="_blank" className="text-blue-400 hover:underline">Lichess Personal Access Token</a> for faster analysis (10 req/sec vs 1/sec):
      </p>
      <div className="flex gap-2">
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="lip_..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleLogin}
          disabled={!token.trim()}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded text-sm font-medium transition-colors"
        >
          Connect
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-1">Token stays in your browser only. Never sent to any server.</p>
    </div>
  );
}
