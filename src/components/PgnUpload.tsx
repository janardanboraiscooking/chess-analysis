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
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500'
        }`}
      >
        <p className="text-gray-400 mb-4">
          Drag and drop a .pgn file here, or paste PGN below
        </p>
        <textarea
          value={pgnText}
          onChange={(e) => setPgnText(e.target.value)}
          placeholder={'[Event "Casual Game"]\n[White "Player 1"]\n[Black "Player 2"]\n[Result "*"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 *'}
          className="w-full h-32 bg-gray-900 border border-gray-700 rounded p-3 text-sm font-mono text-gray-300 resize-none focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => pgnText.trim() && onPgnSubmit(pgnText)}
          disabled={!pgnText.trim()}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded font-medium transition-colors"
        >
          Analyze Game
        </button>
      </div>
    </div>
  );
}
