'use client';
import Reveal from '@/components/ui/Reveal';

export default function Support() {
  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
      <Reveal>
        <span className="tag tag-gold mb-4 inline-block">Support</span>
        <h1 className="text-4xl mb-4">Support Center</h1>
        <p className="text-base mb-10" style={{ color: 'var(--text-secondary)' }}>
          Need help? We&apos;re here for you.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="space-y-4">
          {[
            { icon: '📖', title: 'Documentation', desc: 'Check the docs for installation guides, UCI protocol reference, and API documentation.', link: '/docs' },
            { icon: '💬', title: 'Discord Community', desc: 'Join our Discord server for real-time help from the community and developers.', link: '#' },
            { icon: '🐛', title: 'Bug Reports', desc: 'Found a bug? Open an issue on GitHub with steps to reproduce.', link: 'https://github.com/janardanboraiscooking/chess-analysis/issues' },
            { icon: '❓', title: 'FAQ', desc: 'Browse frequently asked questions for quick answers.', link: '/faq' },
          ].map(item => (
            <a key={item.title} href={item.link} className="surface surface-hover p-5 flex items-start gap-4 block">
              <span className="text-2xl mt-0.5">{item.icon}</span>
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: 'Inter' }}>{item.title}</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
