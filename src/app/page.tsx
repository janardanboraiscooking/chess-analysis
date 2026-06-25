'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,168,76,0.08)_0%,transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-24 relative">
          <div className="text-center fade-in">
            <div className="gold-line w-16 mx-auto mb-8" />
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--gold)] text-[#0a0a0a]">
                <span className="text-2xl font-bold font-[Playfair_Display]">♚</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight text-[var(--cream)]">GoatedChess</h1>
            <p className="text-xl mb-3 font-[Playfair_Display] text-[var(--cream-dim)]">A chess engine under development</p>
            <p className="text-base max-w-lg mx-auto mb-10 text-[var(--cream-muted)]">
              Built from scratch in C++ with bitboards, magic attacks, tapered evaluation, and advanced search. Currently aiming for 2300+ Elo.
            </p>
            <Link href="/analyse" className="btn inline-block text-base px-8 py-3">Analyze a Game</Link>
          </div>
        </div>
      </section>

      {/* Engine */}
      <section className="border-t border-[#222]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="gold-line w-12 mb-8" />
          <h2 className="text-3xl font-bold mb-10 text-[var(--cream)]">The Engine</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {[
              { icon: '⚔', title: 'Search', desc: 'Alpha-Beta with PVS, Null Move Pruning, Late Move Reductions, Futility Pruning, Singular Extensions, and Check Extensions. 3D History Heuristic for move ordering.' },
              { icon: '♜', title: 'Evaluation', desc: 'Tapered MG/EG with Ethereal Piece-Square Tables. Bishop pair, passed pawns with king proximity, knight outposts, rook evaluation, mobility, king safety, and pawn storms.' },
              { icon: '⚡', title: 'Infrastructure', desc: '64-bit Zobrist Transposition Table with generation counters, magic bitboards for attack generation, opening book with 100+ entries, and dynamic time management.' },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <div className="text-2xl mb-3 text-[var(--gold)]">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--cream)]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--cream-dim)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analyzer */}
      <section className="border-t border-[#222] bg-[#111]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="gold-line w-12 mb-8" />
          <h2 className="text-3xl font-bold mb-4 text-[var(--cream)]">The Analyzer</h2>
          <p className="text-base max-w-2xl mb-10 text-[var(--cream-dim)]">
            This tool uses Stockfish running directly in your browser via WebAssembly. Upload any PGN and get instant analysis with move classifications, evaluation graphs, and accuracy metrics.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-3 text-[var(--cream)]">How it works</h3>
              <ul className="space-y-2 text-sm text-[var(--cream-dim)]">
                {['PGN is parsed into individual positions', 'Lichess cloud eval (depth 70+) + Stockfish.online (depth 15) + local fallback', '5 parallel workers for fast analysis', 'Moves classified by win% delta (Lichess algorithm)'].map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="text-[var(--gold)]">→</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-3 text-[var(--cream)]">Features</h3>
              <ul className="space-y-2 text-sm text-[var(--cream-dim)]">
                {['Best, Excellent, Good, Inaccuracy, Mistake, Blunder', 'Evaluation graph with per-move eval', 'ACPL for both sides', 'Save and revisit analyzed games'].map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="text-[var(--gold)]">→</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#222] py-8">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <span className="text-sm text-[var(--cream-muted)]">GoatedChess Engine — Under Development</span>
          <span className="text-sm text-[var(--cream-muted)]">Powered by Stockfish</span>
        </div>
      </footer>
    </main>
  );
}
