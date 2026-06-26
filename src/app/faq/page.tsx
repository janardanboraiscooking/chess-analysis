'use client';
import { useState } from 'react';
import Reveal, { StaggerReveal } from '@/components/ui/Reveal';

const faqs = [
  { q: 'What is GoatedChess?', a: 'GoatedChess is a chess engine written entirely in C++ from scratch. It uses bitboards, magic bitboards, tapered evaluation, and advanced search techniques.' },
  { q: 'How strong is GoatedChess?', a: 'The current version targets 2300+ Elo. It has beaten Stockfish at lower depths in tournament conditions. Ongoing Texel tuning and evaluation improvements are expected to increase strength.' },
  { q: 'Is GoatedChess open source?', a: 'Yes. GoatedChess is MIT licensed. You can read, modify, and distribute the code freely.' },
  { q: 'How do I compile GoatedChess?', a: 'Clone the repository and compile with: clang++ -O3 -std=c++17 -o goatedchess michess.cpp -lm. Requires a C++17 compatible compiler.' },
  { q: 'What is the UCI protocol?', a: 'UCI (Universal Chess Interface) is a standard protocol for communicating with chess engines. GoatedChess implements the full UCI specification.' },
  { q: 'Can I use GoatedChess in my own project?', a: 'Yes, under the MIT license. You can embed it, build on top of it, or use it as a sparring partner for your own engine.' },
  { q: 'Does GoatedChess have an opening book?', a: 'Yes, it includes a built-in opening book with 100+ entries covering major openings from the starting position.' },
  { q: 'How does the game analyzer work?', a: 'The analyzer uses Stockfish cloud evaluation at depth 15 to analyze each position in your game. It classifies moves and calculates accuracy scores.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
      <Reveal>
        <span className="tag tag-gold mb-4 inline-block">FAQ</span>
        <h1 className="text-4xl mb-4">Frequently Asked Questions</h1>
        <p className="text-base mb-10" style={{ color: 'var(--text-secondary)' }}>Quick answers to common questions.</p>
      </Reveal>

      <StaggerReveal className="space-y-2">
        {faqs.map((f, i) => (
          <div key={i} className="surface overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full p-5 text-left flex items-center justify-between">
              <span className="text-sm font-medium" style={{ fontFamily: 'Inter' }}>{f.q}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }}>
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-sm" style={{ color: 'var(--text-secondary)', animation: 'fadeIn 0.2s ease' }}>
                {f.a}
              </div>
            )}
          </div>
        ))}
      </StaggerReveal>
    </div>
  );
}
