'use client';
import Reveal from '@/components/ui/Reveal';

const posts = [
  { date: '2026', title: 'Building a Chess Engine from Scratch', desc: 'The story behind GoatedChess — why we built it, what we learned, and where it\'s going.', tag: 'Engineering' },
  { date: '2026', title: 'Texel Tuning: What Works and What Doesn\'t', desc: 'Our experiments with Texel-style parameter optimization and why MSE isn\'t everything.', tag: 'Research' },
  { date: '2025', title: 'Magic Bitboards Explained', desc: 'How we use precomputed magic numbers for efficient slider attack generation.', tag: 'Tutorial' },
  { date: '2025', title: 'First Tournament Win Against Stockfish', desc: 'The moment GoatedChess beat Stockfish in an official tournament game.', tag: 'Milestone' },
];

export default function Blog() {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <Reveal>
        <span className="tag tag-gold mb-4 inline-block">Blog</span>
        <h1 className="text-4xl md:text-5xl mb-4">News & Updates</h1>
        <p className="text-base mb-12" style={{ color: 'var(--text-secondary)' }}>Engineering notes, milestones, and chess engine deep dives.</p>
      </Reveal>

      <div className="space-y-4">
        {posts.map((p, i) => (
          <Reveal key={i} delay={i * 60}>
            <article className="surface surface-hover p-6 flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="tag text-[10px]">{p.tag}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.date}</span>
                </div>
                <h3 className="text-lg mb-1" style={{ fontFamily: 'Inter', fontWeight: 600 }}>{p.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-2" style={{ color: 'var(--text-muted)' }}><path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
