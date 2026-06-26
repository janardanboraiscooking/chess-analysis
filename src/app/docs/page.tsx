'use client';
import Reveal from '@/components/ui/Reveal';
import Link from 'next/link';

const sections = [
  { title: 'Getting Started', items: [
    { label: 'Installation', href: '#installation' },
    { label: 'Quick Start', href: '#quickstart' },
    { label: 'UCI Protocol', href: '#uci' },
  ]},
  { title: 'Engine', items: [
    { label: 'Search Algorithm', href: '#search' },
    { label: 'Evaluation Function', href: '#evaluation' },
    { label: 'Transposition Table', href: '#tt' },
    { label: 'Opening Book', href: '#book' },
  ]},
  { title: 'API Reference', items: [
    { label: 'UCI Commands', href: '#commands' },
    { label: 'Options', href: '#options' },
  ]},
];

export default function Docs() {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Reveal>
            <h2 className="text-lg mb-4" style={{ fontFamily: 'Inter', fontWeight: 600 }}>Documentation</h2>
            {sections.map(s => (
              <div key={s.title} className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{s.title}</div>
                <ul className="space-y-1">
                  {s.items.map(item => (
                    <li key={item.label}>
                      <a href={item.href} className="text-sm block py-1 transition-colors" style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--text)'}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--text-secondary)'}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </aside>

        <div className="min-w-0">
          <Reveal>
            <div className="mb-12">
              <h1 className="text-4xl mb-4">Documentation</h1>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                Everything you need to compile, run, and integrate GoatedChess.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div id="installation" className="mb-12">
              <h2 className="text-2xl mb-4">Installation</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Clone and compile from source:</p>
              <div className="mono text-xs p-4 rounded-lg" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                <div>git clone https://github.com/janardanboraiscooking/chess-analysis.git</div>
                <div>cd chess-analysis/chess</div>
                <div>clang++ -O3 -std=c++17 -o goatedchess michess.cpp -lm</div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div id="quickstart" className="mb-12">
              <h2 className="text-2xl mb-4">Quick Start</h2>
              <div className="mono text-xs p-4 rounded-lg" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                <div>echo -e "uci\nisready\nposition startpos\ngo depth 10\nquit" | ./goatedchess</div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div id="uci" className="mb-12">
              <h2 className="text-2xl mb-4">UCI Protocol</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                GoatedChess implements the Universal Chess Interface (UCI) protocol. Send commands via stdin, receive responses via stdout.
              </p>
              <div className="surface p-4 mt-4">
                <div className="space-y-2 mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <div><span className="text-[var(--gold)]">uci</span> — Initialize the engine</div>
                  <div><span className="text-[var(--gold)]">isready</span> — Wait for engine to be ready</div>
                  <div><span className="text-[var(--gold)]">position startpos</span> — Set starting position</div>
                  <div><span className="text-[var(--gold)]">position fen &lt;FEN&gt;</span> — Set position from FEN</div>
                  <div><span className="text-[var(--gold)]">go depth &lt;N&gt;</span> — Search to depth N</div>
                  <div><span className="text-[var(--gold)]">go movetime &lt;ms&gt;</span> — Search for N milliseconds</div>
                  <div><span className="text-[var(--gold)]">quit</span> — Exit the engine</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
