'use client';
import Reveal, { StaggerReveal } from '@/components/ui/Reveal';

const changes = [
  { version: 'v17.0', date: '2026', items: ['Centralized EvalParams struct', 'Texel tuning pipeline (10 epochs, 932K positions)', 'Passed pawn scaling with defensive resources', 'Threat evaluation (lower-value attacker + pin detection)', 'TT legality audit — 0 illegal moves confirmed', 'Bug fixes: castling corruption, sentinel leak, pos.fm double-decrement'] },
  { version: 'v15', date: '2025', items: ['Won vs Stockfish depth 5 and 6', 'LMR optimization (baseline beats all variants)', 'Countermove history (rank-1 improved 11.4%)', 'Castling corruption fix (0% crash rate)', 'Score normalization (scoreToTT/scoreFromTT)'] },
  { version: 'v14', date: '2025', items: ['Won vs Stockfish depth 4', 'Development features', 'King safety improvements', 'Castled king bonus'] },
  { version: 'v8', date: '2024', items: ['First tournament wins', 'Opening book (100+ entries)', 'Basic search with alpha-beta'] },
];

export default function Changelog() {
  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
      <Reveal>
        <span className="tag tag-gold mb-4 inline-block">Changelog</span>
        <h1 className="text-4xl mb-4">Changelog</h1>
        <p className="text-base mb-12" style={{ color: 'var(--text-secondary)' }}>Release history and what changed in each version.</p>
      </Reveal>

      <StaggerReveal className="space-y-8">
        {changes.map(c => (
          <div key={c.version}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg font-bold" style={{ fontFamily: 'Inter' }}>{c.version}</span>
              <span className="tag text-[10px]">{c.date}</span>
            </div>
            <div className="surface p-5">
              <ul className="space-y-2">
                {c.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--gold)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </StaggerReveal>
    </div>
  );
}
