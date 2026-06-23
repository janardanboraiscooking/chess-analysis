'use client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { PositionEval } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

interface EvalGraphProps {
  evals: PositionEval[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

export default function EvalGraph({ evals, currentMoveIndex, onMoveClick }: EvalGraphProps) {
  const data = {
    labels: evals.map((_, i) => i.toString()),
    datasets: [{
      data: evals.map(e => e.eval / 100),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.08)',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: evals.map((_, i) => i === currentMoveIndex ? 5 : 0),
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_: any, elements: any) => {
      if (elements.length > 0) onMoveClick(elements[0].index);
    },
    scales: {
      x: { display: false },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
        ticks: {
          color: '#64748b',
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (v: any) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`,
        },
        border: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a25',
        borderColor: '#334155',
        borderWidth: 1,
        titleFont: { family: 'JetBrains Mono', size: 12 },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: any) => `Eval: ${ctx.parsed.y > 0 ? '+' : ''}${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Evaluation</h3>
      <div className="h-32">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
