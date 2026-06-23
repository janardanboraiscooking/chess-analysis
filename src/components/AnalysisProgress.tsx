'use client';

interface AnalysisProgressProps {
  current: number;
  total: number;
  status: 'idle' | 'analyzing' | 'done' | 'error';
  currentMove?: string;
}

export default function AnalysisProgress({ current, total, status, currentMove }: AnalysisProgressProps) {
  if (status === 'idle') return null;
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">
          {status === 'analyzing' && `Analyzing... Position ${current} / ${total}`}
          {status === 'done' && 'Analysis complete'}
          {status === 'error' && 'Analysis error'}
        </span>
        <span className="text-sm text-gray-500">{percent}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            status === 'error' ? 'bg-red-500' : status === 'done' ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {currentMove && <p className="text-xs text-gray-500 mt-2">Last: {currentMove}</p>}
    </div>
  );
}
