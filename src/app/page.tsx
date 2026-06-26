'use client';
import Link from 'next/link';
import Reveal, { StaggerReveal } from '@/components/ui/Reveal';

const stats = [
  { value: '2300+', label: 'Target Elo' },
  { value: '20K', label: 'Lines of C++' },
  { value: '100%', label: 'From Scratch' },
  { value: 'MIT', label: 'Open Source' },
];

const features = [
  { icon: '⚡', title: 'Advanced Search', desc: 'Alpha-Beta with PVS, Null Move Pruning, LMR, Futility Pruning, Singular Extensions, and 3D History Heuristic.', tag: 'Search' },
  { icon: '♜', title: 'Tapered Evaluation', desc: 'Middle-game and endgame phase interpolation with Ethereal PSTs, passed pawn king proximity, knight outposts, and king safety.', tag: 'Evaluation' },
  { icon: '🔮', title: 'Magic Bitboards', desc: 'Efficient slider piece attack generation using precomputed magic bitboard tables for rooks, bishops, and queens.', tag: 'Infrastructure' },
  { icon: '🧩', title: 'Transposition Table', desc: '64-bit Zobrist hashing with generation counters, depth-preferred replacement, and proper mate score normalization.', tag: 'Infrastructure' },
  { icon: '📊', title: 'Opening Book', desc: 'Built-in opening book with 100+ entries covering major openings. Instant move lookup from the starting position.', tag: 'Opening' },
  { icon: '⏱', title: 'Time Management', desc: 'Dynamic time allocation based on position complexity, move stability, and remaining time. Never flags in blitz.', tag: 'Search' },
];

const timeline = [
  { date: '2024', title: 'Project inception', desc: 'Started building a chess engine from scratch in C++.' },
  { date: '2025', title: 'Core engine complete', desc: 'Bitboards, magic attacks, search, evaluation, and TT all working.' },
  { date: '2025', title: 'Web analyzer launched', desc: 'Browser-based game analysis with Stockfish cloud integration.' },
  { date: '2026', title: 'Public release', desc: 'Open source release with documentation and community tools.' },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 chess-pattern opacity-40" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(232,197,71,0.06) 0%, transparent 60%)' }} />

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 relative z-10 w-full">
          <div className="max-w-3xl">
            <Reveal>
              <div className="flex items-center gap-2 mb-6">
                <span className="tag tag-gold">Open Source</span>
                <span className="tag">v17.0</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="text-5xl md:text-7xl lg:text-[80px] leading-[0.95] tracking-tight mb-6">
                A chess engine<br />
                <span className="text-gradient">built from scratch</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="text-lg md:text-xl max-w-xl mb-10" style={{ color: 'var(--text-secondary)' }}>
                GoatedChess is a chess engine written entirely in C++ — bitboards, magic attacks,
                tapered evaluation, and advanced search. No borrowed code. No shortcuts.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="flex flex-wrap gap-3">
                <Link href="/features" className="btn-primary btn-lg">
                  Explore Features
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link href="/download" className="btn-secondary btn-lg">Download</Link>
                <Link href="https://github.com/janardanboraiscooking" target="_blank" rel="noopener" className="btn-secondary btn-lg">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                  Source
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Stats row */}
          <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {stats.map(s => (
              <div key={s.label} className="surface p-5">
                <div className="text-2xl font-bold tracking-tight text-gradient mb-1" style={{ fontFamily: 'Inter' }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Engine features */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <span className="tag tag-gold mb-4 inline-block">Engine</span>
              <h2 className="text-4xl md:text-5xl mb-4">Every component,<br />built intentionally</h2>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                No borrowed evaluation weights. No copied search heuristics. Every line of code exists because it earned its place.
              </p>
            </div>
          </Reveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => (
              <div key={f.title} className="surface surface-hover p-6 group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="tag text-[10px]">{f.tag}</span>
                </div>
                <h3 className="text-lg mb-2" style={{ fontFamily: 'Inter', fontWeight: 600 }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Analyzer section */}
      <section className="py-28 relative" style={{ background: 'var(--bg-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <span className="tag tag-blue mb-4 inline-block">Analyzer</span>
              <h2 className="text-4xl md:text-5xl mb-6">Analyze your games<br />in seconds</h2>
              <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
                Upload any PGN and get instant Stockfish-powered analysis. Deep cloud evaluation,
                move classifications, accuracy scores, and interactive eval graphs.
              </p>
              <div className="space-y-3 mb-8">
                {['Cloud Stockfish at depth 15', 'Best / Excellent / Good / Inaccuracy / Mistake / Blunder', 'Interactive eval graph', 'Save and revisit games'].map(t => (
                  <div key={t} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(34,197,94,0.1)' }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t}</span>
                  </div>
                ))}
              </div>
              <Link href="/analyse" className="btn-primary">
                Try the Analyzer
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </Reveal>

            <Reveal delay={100}>
              <div className="surface p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                  <span className="ml-3 mono text-xs" style={{ color: 'var(--text-muted)' }}>analysis — depth 15</span>
                </div>
                <div className="mono text-xs space-y-1.5" style={{ color: 'var(--text-muted)' }}>
                  <div><span style={{ color: 'var(--text-secondary)' }}>position</span> fen rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1</div>
                  <div><span style={{ color: 'var(--text-secondary)' }}>go</span> depth 15</div>
                  <div><span style={{ color: 'var(--accent-green)' }}>info</span> depth 15 score cp 18 pv e7e5 g1f3</div>
                  <div><span style={{ color: 'var(--accent-green)' }}>info</span> depth 15 score cp 22 pv e7e5 g1f3 b8c6</div>
                  <div><span style={{ color: 'var(--gold)' }}>bestmove</span> e7e5 ponder g1f3</div>
                  <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Classification:</span> <span className="badge-excellent">Excellent</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Accuracy:</span> <span className="text-gradient font-semibold">94.2%</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <span className="tag tag-green mb-4 inline-block">Journey</span>
              <h2 className="text-4xl md:text-5xl mb-4">From first line to release</h2>
            </div>
          </Reveal>

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ background: 'var(--border)' }} />
            <StaggerReveal className="space-y-12">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10" style={{ background: 'var(--bg-card)', border: '2px solid var(--border-strong)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
                  </div>
                  <div>
                    <div className="mono text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t.date}</div>
                    <h3 className="text-lg mb-1" style={{ fontFamily: 'Inter', fontWeight: 600 }}>{t.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(232,197,71,0.06) 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-5xl mb-6">Ready to analyze<br />your games?</h2>
            <p className="text-base mb-10" style={{ color: 'var(--text-secondary)' }}>
              Upload a PGN, explore openings, or solve tactical puzzles — all powered by Stockfish.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/analyse" className="btn-primary btn-lg">Start Analyzing</Link>
              <Link href="/features" className="btn-secondary btn-lg">Learn More</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
