'use client';

interface Props { current: number; total: number; status: 'idle' | 'analyzing' | 'done' | 'error'; currentMove?: string; }

export default function AnalysisProgress({ current, total, status, currentMove }: Props) {
  if (status === 'idle') return null;
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {status === 'analyzing' && <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] progress-animated" />}
          {status === 'done' && <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />}
          {status === 'error' && <div className="w-1.5 h-1.5 rounded-full bg-[var(--red)]" />}
          <span className="text-sm font-medium text-[var(--cream)]">
            {status === 'analyzing' && `Analyzing ${current} / ${total}`}
            {status === 'done' && 'Complete'}
            {status === 'error' && 'Failed'}
          </span>
        </div>
        <span className="mono text-xs text-[var(--cream-muted)]">{pct}%</span>
      </div>
      <div className="w-full rounded-full h-1 bg-[#111]">
        <div className="h-1 rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: status === 'error' ? 'var(--red)' : status === 'done' ? 'var(--green)' : 'var(--gold)' }} />
      </div>
      {currentMove && status === 'analyzing' && <p className="mono text-xs mt-2 text-[var(--cream-muted)]">Last: {currentMove}</p>}
    </div>
  );
}
