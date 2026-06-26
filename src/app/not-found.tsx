'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl font-bold text-gradient mb-4" style={{ fontFamily: 'Inter' }}>404</div>
        <h1 className="text-2xl mb-3">Checkmate</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>This page has been captured. No legal moves remaining.</p>
        <div className="flex justify-center gap-3">
          <Link href="/" className="btn-primary">Return Home</Link>
          <Link href="/analyse" className="btn-secondary">Analyze a Game</Link>
        </div>
      </div>
    </div>
  );
}
