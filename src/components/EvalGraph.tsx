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
      borderColor: '#6b7280',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: evals.map((_, i) => i === currentMoveIndex ? 6 : 2),
      pointBackgroundColor: evals.map((_, i) => i === currentMoveIndex ? '#3b82f6' : '#6b7280'),
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
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#9ca3af', callback: (v: any) => `${v}p` },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx: any) => `Eval: ${ctx.parsed.y.toFixed(2)}` } },
    },
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-2">Evaluation</h3>
      <div className="h-32">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
