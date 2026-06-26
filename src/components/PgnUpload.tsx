'use client';
import { useCallback, useState } from 'react';

interface PgnUploadProps { onPgnSubmit: (pgn: string) => void; }

export default function PgnUpload({ onPgnSubmit }: PgnUploadProps) {
  const [pgnText, setPgnText] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { const text = ev.target?.result as string; setPgnText(text); onPgnSubmit(text); };
      reader.readAsText(file);
    }
  }, [onPgnSubmit]);

  return (
    <div className="max-w-2xl mx-auto px-2 md:px-0">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`surface p-8 md:p-10 text-center transition-all duration-300 ${isDragging ? 'border-[var(--gold)] shadow-[0_0_30px_rgba(232,197,71,0.1)]' : ''}`}
      >
        <div className="mb-6">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(232,197,71,0.1)', border: '1px solid rgba(232,197,71,0.2)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--gold)' }}>
              <path d="M3 13v4a1 1 0 001 1h12a1 1 0 001-1v-4M10 3v10m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Drop your PGN file here</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>or paste the moves below</p>
        </div>
        <textarea
          value={pgnText}
          onChange={(e) => setPgnText(e.target.value)}
          placeholder={'[Event "Casual Game"]\n[White "Player 1"]\n[Black "Player 2"]\n[Result "*"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 *'}
          className="input-field h-32 md:h-40 mono text-[11px] resize-none mb-4"
          style={{ background: 'var(--bg-subtle)' }}
        />
        <button
          onClick={() => pgnText.trim() && onPgnSubmit(pgnText)}
          disabled={!pgnText.trim()}
          className="btn-primary w-full py-2.5 disabled:opacity-30"
        >
          Analyze Game
        </button>
      </div>
    </div>
  );
}
