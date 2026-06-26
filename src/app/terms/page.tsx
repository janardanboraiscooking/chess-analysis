import Reveal from '@/components/ui/Reveal';

export default function Terms() {
  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
      <Reveal>
        <h1 className="text-3xl mb-6">Terms of Service</h1>
        <div className="prose prose-sm" style={{ color: 'var(--text-secondary)' }}>
          <p className="mb-4"><strong>Last updated:</strong> January 2026</p>
          <h2 className="text-lg mt-8 mb-3" style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--text)' }}>Acceptance</h2>
          <p className="mb-4 text-sm leading-relaxed">By using GoatedChess, you agree to these terms. The service is provided &quot;as is&quot; without warranties.</p>
          <h2 className="text-lg mt-8 mb-3" style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--text)' }}>Use</h2>
          <p className="mb-4 text-sm leading-relaxed">GoatedChess is free to use. You may analyze games, explore openings, and solve puzzles. Commercial use of the engine is permitted under the MIT license.</p>
          <h2 className="text-lg mt-8 mb-3" style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--text)' }}>Limitation</h2>
          <p className="text-sm leading-relaxed">We are not liable for any damages arising from use of the service. Analysis results may not be 100% accurate.</p>
        </div>
      </Reveal>
    </div>
  );
}
