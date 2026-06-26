import Reveal from '@/components/ui/Reveal';

export default function Cookies() {
  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
      <Reveal>
        <h1 className="text-3xl mb-6">Cookie Policy</h1>
        <div className="prose prose-sm" style={{ color: 'var(--text-secondary)' }}>
          <p className="mb-4"><strong>Last updated:</strong> January 2026</p>
          <h2 className="text-lg mt-8 mb-3" style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--text)' }}>Cookies</h2>
          <p className="mb-4 text-sm leading-relaxed">GoatedChess uses minimal cookies for essential functionality (session preference, theme). We do not use tracking or advertising cookies.</p>
          <h2 className="text-lg mt-8 mb-3" style={{ fontFamily: 'Inter', fontWeight: 600, color: 'var(--text)' }}>Local Storage</h2>
          <p className="text-sm leading-relaxed">Analyzed games are stored in your browser&apos;s IndexedDB for convenience. This data never leaves your device.</p>
        </div>
      </Reveal>
    </div>
  );
}
