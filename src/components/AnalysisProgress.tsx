'use client';

interface AnalysisProgressProps {
  current: number;
  total: number;
  status: 'idle' | 'analyzing' | 'done' | 'error';
  currentMove?: string;
}

export default function AnalysisProgress({ current, total, status, currentMove }: AnalysisProgressProps) {
  if (status === 'idle') return null;
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {status === 'analyzing' && (
            <div className="w-2 h-2 rounded-full bg-blue-500 progress-animated" />
          )}
          {status === 'done' && (
            <div className="w-2 h-2 rounded-full bg-green-500" />
          )}
          {status === 'error' && (
            <div className="w-2 h-2 rounded-full bg-red-500" />
          )}
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {status === 'analyzing' && `Analyzing position ${current} / ${total}`}
            {status === 'done' && 'Analysis complete'}
            {status === 'error' && 'Analysis error'}
          </span>
        </div>
        <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>{percent}%</span>
      </div>

      <div className="w-full rounded-full h-1.5" style={{ background: 'var(--bg-secondary)' }}>
        <div
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: `${percent}%`,
            background: status === 'error'
              ? 'var(--red)'
              : status === 'done'
                ? 'var(--green)'
                : 'linear-gradient(90deg, #6366f1, #a855f7)',
          }}
        />
      </div>

      {currentMove && status === 'analyzing' && (
        <p className="text-xs mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>
          Last: {currentMove}
        </p>
      )}
    </div>
  );
}
