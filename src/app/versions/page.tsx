'use client';
import Reveal, { StaggerReveal } from '@/components/ui/Reveal';

const versions = [
  { version: 'v17.0', elo: '2300+', year: '2026', highlights: 'Centralized EvalParams, PP scaling, threat eval, Texel tuning' },
  { version: 'v15', elo: '2100+', year: '2025', highlights: 'Won vs Stockfish d5/d6, LMR optimization, countermove history' },
  { version: 'v14', elo: '1900+', year: '2025', highlights: 'Won vs Stockfish d4, development features, king safety' },
  { version: 'v8', elo: '1600+', year: '2024', highlights: 'First tournament wins, opening book, basic search' },
];

export default function Versions() {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-6">
      <Reveal>
        <span className="tag tag-gold mb-4 inline-block">Version History</span>
        <h1 className="text-4xl mb-4">Engine Evolution</h1>
        <p className="text-base mb-12" style={{ color: 'var(--text-secondary)' }}>
          Track GoatedChess strength progression across versions.
        </p>
      </Reveal>

      <StaggerReveal className="space-y-4">
        {versions.map((v, i) => (
          <div key={v.version} className="surface p-5 flex items-center gap-6">
            <div className="w-16 text-center">
              <div className="text-xl font-bold text-gradient" style={{ fontFamily: 'Inter' }}>{v.elo}</div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{v.year}</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold" style={{ fontFamily: 'Inter' }}>{v.version}</span>
                {i === 0 && <span className="tag tag-green text-[10px]">Latest</span>}
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{v.highlights}</p>
            </div>
          </div>
        ))}
      </StaggerReveal>
    </div>
  );
}
