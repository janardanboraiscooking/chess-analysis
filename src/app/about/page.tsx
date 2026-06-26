'use client';
import Reveal, { StaggerReveal } from '@/components/ui/Reveal';

const values = [
  { title: 'From Scratch', desc: 'No borrowed code. Every line exists because it earned its place.' },
  { title: 'Open Source', desc: 'MIT licensed. Read the code, learn from it, contribute to it.' },
  { title: 'Honest Engineering', desc: 'No borrowed evaluation weights. No copied heuristics. Everything is documented.' },
  { title: 'Community First', desc: 'Built for chess players and engine enthusiasts. Your feedback shapes the roadmap.' },
];

export default function About() {
  return (
    <div className="pt-24 pb-20">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <span className="tag tag-gold mb-4 inline-block">About</span>
            <h1 className="text-4xl md:text-6xl mb-6 max-w-3xl">A chess engine<br />built with purpose</h1>
            <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              GoatedChess started as a learning project — building a chess engine entirely from scratch in C++.
              It grew into something more: an honest, well-documented engine that anyone can read, learn from, and improve.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20" style={{ background: 'var(--bg-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl mb-12">What we believe</h2>
          </Reveal>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map(v => (
              <div key={v.title} className="surface p-6">
                <h3 className="text-lg mb-2" style={{ fontFamily: 'Inter', fontWeight: 600 }}>{v.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl mb-6">The numbers</h2>
          </Reveal>
          <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '20K+', label: 'Lines of C++' },
              { value: '100+', label: 'Opening Book Entries' },
              { value: '5', label: 'Search Extensions' },
              { value: '8', label: 'Eval Components' },
            ].map(s => (
              <div key={s.label} className="surface p-5 text-center">
                <div className="text-2xl font-bold text-gradient mb-1" style={{ fontFamily: 'Inter' }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>
    </div>
  );
}
