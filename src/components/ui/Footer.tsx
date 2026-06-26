'use client';
import Link from 'next/link';

const columns = [
  { title: 'Product', links: [
    { label: 'Features', href: '/features' },
    { label: 'Download', href: '/download' },
    { label: 'Benchmarks', href: '/benchmarks' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Pricing', href: '/pricing' },
  ]},
  { title: 'Engine', links: [
    { label: 'Architecture', href: '/features#architecture' },
    { label: 'Version History', href: '/versions' },
    { label: 'Leaderboards', href: '/leaderboards' },
    { label: 'Documentation', href: '/docs' },
  ]},
  { title: 'Community', links: [
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
    { label: 'Support', href: '/support' },
  ]},
  { title: 'Legal', links: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ]},
];

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-gold)' }}>
                <span className="text-xs font-bold text-[#09090b]">♚</span>
              </div>
              <span className="font-semibold text-sm text-[var(--text)]">GoatedChess</span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              A chess engine built from scratch in C++. Open source, community driven.
            </p>
          </div>
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)', fontFamily: 'Inter' }}>{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm transition-colors duration-150" style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--text)'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--text-muted)'}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="section-divider my-10" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© 2026 GoatedChess. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/janardanboraiscooking" target="_blank" rel="noopener" className="text-xs transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--text)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--text-muted)'}>
              GitHub
            </a>
            <a href="https://discord.gg/goatedchess" target="_blank" rel="noopener" className="text-xs transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--text)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--text-muted)'}>
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
