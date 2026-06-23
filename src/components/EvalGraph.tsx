'use client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { PositionEval } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

interface Props { evals: PositionEval[]; currentMoveIndex: number; onMoveClick: (i: number) => void; }

export default function EvalGraph({ evals, currentMoveIndex, onMoveClick }: Props) {
  const data = {
    labels: evals.map((_, i) => i.toString()),
    datasets: [{ data: evals.map(e => e.eval / 100), borderColor: '#c9a84c', backgroundColor: 'rgba(201,168,76,0.06)', fill: true, tension: 0.4, borderWidth: 1.5, pointRadius: evals.map((_, i) => i === currentMoveIndex ? 4 : 0), pointBackgroundColor: '#c9a84c', pointBorderColor: '#0a0a0a', pointBorderWidth: 2 }],
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    onClick: (_: any, el: any) => { if (el.length > 0) onMoveClick(el[0].index); },
    scales: {
      x: { display: false },
      y: { grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false }, ticks: { color: '#6b6358', font: { family: 'JetBrains Mono', size: 10 }, callback: (v: any) => `${v > 0 ? '+' : ''}${v.toFixed(1)}` }, border: { display: false } },
    },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#161616', borderColor: '#333', borderWidth: 1, titleFont: { family: 'JetBrains Mono', size: 11 }, bodyFont: { family: 'JetBrains Mono', size: 11 }, padding: 8, cornerRadius: 6, callbacks: { label: (ctx: any) => `${ctx.parsed.y > 0 ? '+' : ''}${ctx.parsed.y.toFixed(2)}` } } },
  };

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2 text-[var(--cream-dim)] font-[Playfair_Display]">Evaluation</h3>
      <div className="h-28"><Line data={data} options={options} /></div>
    </div>
  );
}
