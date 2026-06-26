'use client';
import Reveal from '@/components/ui/Reveal';

export default function Privacy() {
  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
      <Reveal>
        <h1 className="text-3xl mb-6">Privacy Policy</h1>
        <div className="prose prose-sm" style={{ color: 'var(--text-secondary)' }}>
          <p className="mb-4"><strong>Last updated:</strong> January 2026</p>
          <h2 className="text-lg mt-8 mb-3" style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--text)' }}>Information We Collect</h2>
          <p className="mb-4 text-sm leading-relaxed">GoatedChess operates as a client-side application. Game analysis is performed locally in your browser or via third-party APIs (Stockfish.online, Lichess). We do not collect, store, or transmit your game data.</p>
          <h2 className="text-lg mt-8 mb-3" style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--text)' }}>Analytics</h2>
          <p className="mb-4 text-sm leading-relaxed">We may use privacy-respecting analytics to understand how the site is used. No personal data is collected.</p>
          <h2 className="text-lg mt-8 mb-3" style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--text)' }}>Contact</h2>
          <p className="text-sm leading-relaxed">For privacy concerns, contact us at privacy@goatedchess.com.</p>
        </div>
      </Reveal>
    </div>
  );
}
