'use client';
import { useCallback, useState } from 'react';

interface PgnUploadProps {
  onPgnSubmit: (pgn: string) => void;
}

export default function PgnUpload({ onPgnSubmit }: PgnUploadProps) {
  const [pgnText, setPgnText] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setPgnText(text);
        onPgnSubmit(text);
      };
      reader.readAsText(file);
    }
  }, [onPgnSubmit]);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`upload-area p-8 text-center ${isDragging ? 'dragging' : ''}`}
      >
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--accent-glow)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--accent-light)' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className="text-lg font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Drop your PGN file here
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            or paste the PGN below
          </p>
        </div>

        <textarea
          value={pgnText}
          onChange={(e) => setPgnText(e.target.value)}
          placeholder={'[Event "Casual Game"]\n[White "Player 1"]\n[Black "Player 2"]\n[Result "*"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 *'}
          className="input-field h-40 font-mono text-sm resize-none mb-4"
        />

        <button
          onClick={() => pgnText.trim() && onPgnSubmit(pgnText)}
          disabled={!pgnText.trim()}
          className="btn-primary w-full text-base"
        >
          Analyze Game
        </button>
      </div>
    </div>
  );
}
