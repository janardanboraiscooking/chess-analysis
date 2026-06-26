'use client';
import Reveal from '@/components/ui/Reveal';

export default function Leaderboards() {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-6">
      <Reveal>
        <span className="tag tag-gold mb-4 inline-block">Leaderboards</span>
        <h1 className="text-4xl mb-4">Leaderboards</h1>
        <p className="text-base mb-12" style={{ color: 'var(--text-secondary)' }}>Community rankings and analysis stats.</p>
      </Reveal>

      <Reveal delay={80}>
        <div className="surface p-8 text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-lg mb-2" style={{ fontFamily: 'Inter', fontWeight: 600 }}>Coming Soon</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Community leaderboards are in development. Track your accuracy, solve puzzles, and compete with other players.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
