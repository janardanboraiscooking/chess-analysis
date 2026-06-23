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
        className={`upload-area p-10 text-center ${isDragging ? 'dragging' : ''}`}
      >
        <div className="mb-6">
          <div className="text-3xl mb-3" style={{ color: 'var(--gold-dim)' }}>♞</div>
          <p className="text-base font-medium mb-1" style={{ color: 'var(--cream)' }}>
            Drop your PGN file here
          </p>
          <p className="text-sm" style={{ color: 'var(--cream-muted)' }}>
            or paste the moves below
          </p>
        </div>

        <textarea
          value={pgnText}
          onChange={(e) => setPgnText(e.target.value)}
          placeholder={'[Event "Casual Game"]\n[White "Player 1"]\n[Black "Player 2"]\n[Result "*"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 *'}
          className="input h-36 mono text-xs resize-none mb-4"
        />

        <button
          onClick={() => pgnText.trim() && onPgnSubmit(pgnText)}
          disabled={!pgnText.trim()}
          className="btn w-full"
        >
          Analyze Game
        </button>
      </div>
    </div>
  );
}
