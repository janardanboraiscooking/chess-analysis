'use client';
import { useState } from 'react';
import { setLichessToken, clearLichessToken, hasLichessToken } from '@/engine/analyzer';

interface LichessLoginProps {
  onTokenChange: () => void;
}

export default function LichessLogin({ onTokenChange }: LichessLoginProps) {
  const [token, setToken] = useState('');
  const [loggedIn, setLoggedIn] = useState(hasLichessToken());
  const [showInput, setShowInput] = useState(false);

  const handleLogin = () => {
    if (token.trim()) {
      setLichessToken(token.trim());
      setLoggedIn(true);
      setToken('');
      setShowInput(false);
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
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs font-medium" style={{ color: 'var(--green)' }}>Lichess Connected</span>
        <button onClick={handleLogout} className="text-xs hover:text-red-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
          Disconnect
        </button>
      </div>
    );
  }

  if (showInput) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="lip_..."
          className="input-field text-xs py-1.5 px-3 w-48"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        <button onClick={handleLogin} disabled={!token.trim()} className="btn-primary text-xs py-1.5 px-3">
          Connect
        </button>
        <button onClick={() => setShowInput(false)} className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowInput(true)}
      className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
      style={{ color: 'var(--accent-light)', background: 'var(--accent-glow)' }}
    >
      + Lichess Token
    </button>
  );
}
