import React from 'react';

export interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showCount?: boolean;
  className?: string;
  variant?: 'primary' | 'success';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  showCount = true,
  className = '',
  variant = 'primary',
}) => {
  const percentage = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

  const barColor =
    variant === 'success' || percentage === 100
      ? 'bg-emerald-600'
      : 'bg-blue-600';

  return (
    <div className={`w-full ${className}`.trim()}>
      {(label || showCount) && (
        <div className="flex items-center justify-between text-sm font-medium mb-1.5 text-slate-700">
          <span>{label}</span>
          {showCount && (
            <span className="font-semibold text-slate-900">
              {current} / {total} {total === 1 ? 'selesai' : 'dokumen'} ({percentage}%)
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div
        className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className={`h-full ${barColor} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
