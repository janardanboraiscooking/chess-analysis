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
    if (token.trim()) { setLichessToken(token.trim()); setLoggedIn(true); setToken(''); setShowInput(false); onTokenChange(); }
  };
  const handleLogout = () => { clearLichessToken(); setLoggedIn(false); onTokenChange(); };

  if (loggedIn) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)' }} />
        <span className="text-xs" style={{ color: 'var(--green)' }}>Connected</span>
        <button onClick={handleLogout} className="text-xs hover:opacity-60 transition-opacity" style={{ color: 'var(--cream-muted)' }}>×</button>
      </div>
    );
  }

  if (showInput) {
    return (
      <div className="flex items-center gap-2">
        <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="lip_..." className="input text-xs py-1.5 px-3 w-44" onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
        <button onClick={handleLogin} disabled={!token.trim()} className="btn text-xs py-1.5 px-3">Connect</button>
        <button onClick={() => setShowInput(false)} className="text-xs" style={{ color: 'var(--cream-muted)' }}>×</button>
      </div>
    );
  }

  return (
    <button onClick={() => setShowInput(true)} className="btn-outline text-xs py-1.5 px-3">
      + Lichess Token
    </button>
  );
}
