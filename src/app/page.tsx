'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.04)_0%,transparent_70%)] float" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.03)_0%,transparent_70%)] float-delay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.02)_0%,transparent_60%)]" />
      </div>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,168,76,0.08)_0%,transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
          <div className="text-center fade-in">
            {/* Floating chess piece */}
            <div className="mb-8 inline-block">
              <div className="w-20 h-20 rounded-2xl glass glow-gold flex items-center justify-center pulse-gold">
                <span className="text-4xl">♚</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
              <span className="text-[var(--cream)]">Goat</span>
              <span className="shimmer-text">ed</span>
              <span className="text-[var(--cream)]">Chess</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-[Playfair_Display] text-[var(--cream-dim)]">
              A chess engine built from scratch
            </p>
            <p className="text-base max-w-xl mx-auto mb-12 text-[var(--cream-muted)] leading-relaxed">
              C++ with bitboards, magic attacks, tapered evaluation, and advanced search.
              Paired with a powerful browser-based game analyzer.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/analyse" className="btn text-base px-10 py-4 glow-gold">
                Analyze a Game
              </Link>
              <Link href="/openings" className="btn-outline text-base px-10 py-4">
                Opening Explorer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Engine Features */}
      <section className="relative py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 fade-in">
            <div className="gold-line w-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--cream)] mb-4">The Engine</h2>
            <p className="text-[var(--cream-muted)] max-w-lg mx-auto">
              Built for understanding, not just playing strength.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {[
              { icon: '⚔', title: 'Search', desc: 'Alpha-Beta with PVS, Null Move Pruning, Late Move Reductions, Futility Pruning, Singular Extensions, and Check Extensions.', color: 'from-amber-500/10 to-transparent' },
              { icon: '♜', title: 'Evaluation', desc: 'Tapered MG/EG with Ethereal PSTs. Bishop pair, passed pawns with king proximity, knight outposts, rook eval, mobility, king safety.', color: 'from-emerald-500/10 to-transparent' },
              { icon: '⚡', title: 'Infrastructure', desc: '64-bit Zobrist TT with generation counters, magic bitboards, opening book with 100+ entries, and dynamic time management.', color: 'from-blue-500/10 to-transparent' },
            ].map((item) => (
              <div key={item.title} className="glass p-8 group hover:scale-[1.02] transition-transform duration-300">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--cream)]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--cream-dim)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analyzer */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,168,76,0.04)_0%,transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <div className="gold-line w-12 mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--cream)]">The Analyzer</h2>
              <p className="text-base text-[var(--cream-dim)] mb-8 leading-relaxed">
                Upload any PGN and get instant analysis powered by Stockfish. Deep cloud evaluation
                with move classifications, accuracy metrics, and interactive boards.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Cloud Stockfish evaluation at depth 15',
                  'Best / Excellent / Good / Inaccuracy / Mistake / Blunder',
                  'Interactive eval graph with per-move analysis',
                  'Save and revisit your analyzed games',
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-[var(--gold-glow)] flex items-center justify-center shrink-0">
                      <span className="text-[var(--gold)] text-xs">✓</span>
                    </span>
                    <span className="text-sm text-[var(--cream-dim)]">{t}</span>
                  </div>
                ))}
              </div>
              <Link href="/analyse" className="btn inline-block">
                Start Analyzing →
              </Link>
            </div>

            <div className="glass p-6 glow-gold fade-in-slow">
              {/* Mock analysis preview */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-[var(--red)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--amber)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--green)]" />
                <span className="ml-2 mono text-xs text-[var(--cream-muted)]">analysis.exe</span>
              </div>
              <div className="space-y-2 mono text-xs">
                <div className="text-[var(--cream-muted)]">position fen rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1</div>
                <div className="text-[var(--cream-muted)]">go depth 15</div>
                <div className="text-[var(--green)]">info depth 15 score cp 18 pv e7e5 g1f3</div>
                <div className="text-[var(--green)]">info depth 15 score cp 22 pv e7e5 g1f3 b8c6</div>
                <div className="text-[var(--gold)]">bestmove e7e5 ponder g1f3</div>
                <div className="text-[var(--cream-muted)]">Classification: <span className="text-[var(--green)]">Excellent</span> (0.3% loss)</div>
                <div className="text-[var(--cream-muted)]">Accuracy: <span className="text-[var(--gold)]">94.2%</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            <Link href="/analyse" className="glass p-8 group text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-lg font-semibold mb-2 text-[var(--cream)]">Game Analysis</h3>
              <p className="text-sm text-[var(--cream-muted)]">Upload PGN, get instant Stockfish analysis</p>
            </Link>
            <Link href="/openings" className="glass p-8 group text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">📖</div>
              <h3 className="text-lg font-semibold mb-2 text-[var(--cream)]">Opening Explorer</h3>
              <p className="text-sm text-[var(--cream-muted)]">Browse openings with Lichess database</p>
            </Link>
            <Link href="/puzzles" className="glass p-8 group text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🧩</div>
              <h3 className="text-lg font-semibold mb-2 text-[var(--cream)]">Puzzles</h3>
              <p className="text-sm text-[var(--cream-muted)]">Tactical puzzles from Lichess</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <span className="text-sm text-[var(--cream-muted)]">GoatedChess Engine</span>
          <span className="text-sm text-[var(--cream-muted)]">Powered by Stockfish</span>
        </div>
      </footer>
    </main>
  );
}
