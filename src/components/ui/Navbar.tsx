'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/benchmarks', label: 'Benchmarks' },
  { href: '/download', label: 'Download' },
  { href: '/docs', label: 'Docs' },
  { href: '/changelog', label: 'Changelog' },
];

const moreLinks = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
  { href: '/leaderboards', label: 'Leaderboards' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setMoreOpen(false); }, [pathname]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-panel !rounded-none border-x-0 border-t-0' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-gold)' }}>
              <span className="text-sm font-bold text-[#09090b]">♚</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-[var(--text)]">GoatedChess</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className={`nav-item ${pathname === l.href ? 'active' : ''}`}>{l.label}</Link>
            ))}
            <div className="relative">
              <button onClick={() => setMoreOpen(!moreOpen)} className="nav-item">More ▾</button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 py-1 glass-panel !rounded-xl" style={{ animation: 'slideDown 0.15s ease' }}>
                  {moreLinks.map(l => (
                    <Link key={l.href} href={l.href} className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-white/5 transition-colors">{l.label}</Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/signin" className="btn-ghost btn-sm">Sign in</Link>
            <Link href="/signup" className="btn-primary btn-sm">Get Started</Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden btn-ghost p-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d={mobileOpen ? "M5 5l10 10M15 5L5 15" : "M3 6h14M3 10h14M3 14h14"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ animation: 'fadeIn 0.15s ease' }}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-14 left-0 right-0 glass-panel !rounded-none border-x-0 p-4" style={{ animation: 'slideDown 0.2s ease' }}>
            {[...navLinks, ...moreLinks].map(l => (
              <Link key={l.href} href={l.href} className={`block py-3 text-sm font-medium ${pathname === l.href ? 'text-[var(--gold)]' : 'text-[var(--text-secondary)]'}`}>{l.label}</Link>
            ))}
            <div className="section-divider my-3" />
            <div className="flex gap-2">
              <Link href="/signin" className="btn-secondary flex-1 text-center">Sign in</Link>
              <Link href="/signup" className="btn-primary flex-1 text-center">Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
