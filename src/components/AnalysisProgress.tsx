'use client';

interface Props { current: number; total: number; status: 'idle' | 'analyzing' | 'done' | 'error'; currentMove?: string; }

export default function AnalysisProgress({ current, total, status, currentMove }: Props) {
  if (status === 'idle') return null;
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="surface p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {status === 'analyzing' && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--gold)' }} />}
          {status === 'done' && <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-green)' }} />}
          {status === 'error' && <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-red)' }} />}
          <span className="text-sm font-medium" style={{ color: 'var(--text)', fontFamily: 'Inter' }}>
            {status === 'analyzing' && `Analyzing ${current} / ${total}`}
            {status === 'done' && 'Complete'}
            {status === 'error' && 'Failed'}
          </span>
        </div>
        <span className="mono text-xs" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
      </div>
      <div className="w-full rounded-full h-1.5" style={{ background: 'var(--bg-subtle)' }}>
        <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: status === 'error' ? 'var(--accent-red)' : status === 'done' ? 'var(--accent-green)' : 'var(--gold)' }} />
      </div>
      {currentMove && status === 'analyzing' && <p className="mono text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Last: {currentMove}</p>}
    </div>
  );
}
