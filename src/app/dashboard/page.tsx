'use client';
import Link from 'next/link';
import Reveal, { StaggerReveal } from '@/components/ui/Reveal';

export default function Dashboard() {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <Reveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-1">Dashboard</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your GoatedChess overview</p>
          </div>
          <Link href="/analyse" className="btn-primary btn-sm">New Analysis</Link>
        </div>
      </Reveal>

      <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Games Analyzed', value: '0', icon: '📊' },
          { label: 'Avg Accuracy', value: '—', icon: '🎯' },
          { label: 'Puzzles Solved', value: '0', icon: '🧩' },
        ].map(s => (
          <div key={s.label} className="surface p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              <span className="text-lg">{s.icon}</span>
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'Inter' }}>{s.value}</div>
          </div>
        ))}
      </StaggerReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="surface p-6">
          <h3 className="text-lg mb-4" style={{ fontFamily: 'Inter', fontWeight: 600 }}>Recent Games</h3>
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <p className="text-sm mb-4">No games analyzed yet</p>
            <Link href="/analyse" className="btn-primary btn-sm">Analyze your first game</Link>
          </div>
        </div>
        <div className="surface p-6">
          <h3 className="text-lg mb-4" style={{ fontFamily: 'Inter', fontWeight: 600 }}>Saved Positions</h3>
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <p className="text-sm">No saved positions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
