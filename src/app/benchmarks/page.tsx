'use client';
import Reveal, { StaggerReveal } from '@/components/ui/Reveal';

const benchmarks = [
  { name: 'Material+PST', gc: 811, sf: 400, unit: 'cp avg error' },
  { name: 'Passed Pawns', gc: 620, sf: 450, unit: 'cp avg error' },
  { name: 'King Safety', gc: 340, sf: 280, unit: 'cp avg error' },
  { name: 'Mobility', gc: 180, sf: 150, unit: 'cp avg error' },
  { name: 'Endgame', gc: 482, sf: 200, unit: 'cp avg error' },
];

const comparisons = [
  { engine: 'GoatedChess v17', elo: '2300+', search: 'AB+PVS+LMR', eval: 'HCE', source: 'Open' },
  { engine: 'Stockfish 17', elo: '3600+', search: 'AB+NNUE', eval: 'NNUE', source: 'Open' },
  { engine: 'Ethereal', elo: '3100+', search: 'AB+NNUE', eval: 'NNUE', source: 'Open' },
  { engine: 'Berserk', elo: '3200+', search: 'AB+NNUE', eval: 'NNUE', source: 'Open' },
];

export default function Benchmarks() {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <Reveal>
        <span className="tag tag-gold mb-4 inline-block">Benchmarks</span>
        <h1 className="text-4xl md:text-5xl mb-4">Engine Benchmarks</h1>
        <p className="text-base mb-12 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
          Performance metrics and comparisons. GoatedChess is an HCE engine — no neural network evaluation.
        </p>
      </Reveal>

      <Reveal>
        <h2 className="text-2xl mb-6">Eval Component Accuracy</h2>
      </Reveal>
      <StaggerReveal className="mb-16">
        <div className="surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left p-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Component</th>
                <th className="text-right p-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>GoatedChess</th>
                <th className="text-right p-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Stockfish</th>
                <th className="text-right p-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map(b => (
                <tr key={b.name} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-4 font-medium">{b.name}</td>
                  <td className="p-4 text-right mono">{b.gc}</td>
                  <td className="p-4 text-right mono" style={{ color: 'var(--accent-green)' }}>{b.sf}</td>
                  <td className="p-4 text-right text-xs" style={{ color: 'var(--text-muted)' }}>{b.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StaggerReveal>

      <Reveal>
        <h2 className="text-2xl mb-6">Engine Comparison</h2>
      </Reveal>
      <StaggerReveal>
        <div className="surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left p-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Engine</th>
                <th className="text-right p-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Elo</th>
                <th className="text-right p-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Search</th>
                <th className="text-right p-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Eval</th>
                <th className="text-right p-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map(c => (
                <tr key={c.engine} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-4 font-medium">{c.engine}</td>
                  <td className="p-4 text-right mono">{c.elo}</td>
                  <td className="p-4 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{c.search}</td>
                  <td className="p-4 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>{c.eval}</td>
                  <td className="p-4 text-right"><span className="tag text-[10px]">{c.source}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StaggerReveal>
    </div>
  );
}
