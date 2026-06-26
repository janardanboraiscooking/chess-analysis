'use client';
import Reveal, { StaggerReveal } from '@/components/ui/Reveal';

const versions = [
  { version: 'v17.0', date: 'Latest', changes: ['Centralized EvalParams', 'Texel tuning pipeline', 'PP scaling with defensive resources', 'Threat evaluation', 'Bug fixes and stability'], current: true },
  { version: 'v15', date: '2025', changes: ['Won vs Stockfish depth 5', 'LMR optimization', 'Countermove history', 'Castling corruption fix'] },
  { version: 'v14', date: '2025', changes: ['Won vs Stockfish depth 4', 'Development features', 'King safety improvements'] },
  { version: 'v8', date: '2024', changes: ['First tournament wins', 'Opening book', 'Basic search'] },
];

export default function Download() {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <Reveal>
        <div className="max-w-2xl mb-12">
          <span className="tag tag-gold mb-4 inline-block">Download</span>
          <h1 className="text-4xl md:text-5xl mb-4">Get GoatedChess</h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Download the latest version of GoatedChess. Compile from source or use a pre-built binary.
          </p>
        </div>
      </Reveal>

      <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="surface p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="tag tag-green">Latest</span>
            <span className="text-sm font-semibold" style={{ fontFamily: 'Inter' }}>v17.0</span>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Stable release with centralized EvalParams and the full Texel tuning pipeline.</p>
          <div className="flex gap-2">
            <button className="btn-primary btn-sm">Download Source</button>
            <button className="btn-secondary btn-sm">View Changelog</button>
          </div>
        </div>
        <div className="surface p-6">
          <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'Inter' }}>Build from Source</h3>
          <div className="mono text-xs p-3 rounded-lg" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
            <div><span style={{ color: 'var(--text-muted)' }}>#</span> Clone the repository</div>
            <div className="mt-1">git clone https://github.com/janardanboraiscooking/chess-analysis.git</div>
            <div className="mt-2"><span style={{ color: 'var(--text-muted)' }}>#</span> Compile with clang++</div>
            <div className="mt-1">clang++ -O3 -std=c++17 -o goatedchess michess.cpp -lm</div>
          </div>
        </div>
      </StaggerReveal>

      <Reveal>
        <h2 className="text-2xl mb-6">Version History</h2>
      </Reveal>
      <StaggerReveal className="space-y-3">
        {versions.map(v => (
          <div key={v.version} className={`surface p-5 ${v.current ? 'border-[var(--gold-dim)]' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ fontFamily: 'Inter' }}>{v.version}</span>
                {v.current && <span className="tag tag-green text-[10px]">Current</span>}
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.date}</span>
            </div>
            <ul className="space-y-1">
              {v.changes.map((c, i) => (
                <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>• {c}</li>
              ))}
            </ul>
          </div>
        ))}
      </StaggerReveal>
    </div>
  );
}
