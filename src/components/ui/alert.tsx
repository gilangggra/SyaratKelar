import React, { HTMLAttributes } from 'react';
import { AlertTriangleIcon, CheckIcon, InfoIcon } from './icons';

export type AlertType = 'info' | 'warning' | 'success' | 'danger';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title?: string;
  icon?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  icon,
  children,
  className = '',
  ...props
}) => {
  const typeConfig: Record<
    AlertType,
    { container: string; title: string; defaultIcon: React.ReactNode }
  > = {
    info: {
      container: 'bg-blue-50/80 border-blue-200 text-blue-900',
      title: 'text-blue-950',
      defaultIcon: <InfoIcon className="w-5 h-5 text-blue-600 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-50/80 border-amber-200 text-amber-900',
      title: 'text-amber-950',
      defaultIcon: <AlertTriangleIcon className="w-5 h-5 text-amber-600 shrink-0" />,
    },
    success: {
      container: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
      title: 'text-emerald-950',
      defaultIcon: <CheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    danger: {
      container: 'bg-rose-50/80 border-rose-200 text-rose-900',
      title: 'text-rose-950',
      defaultIcon: <AlertTriangleIcon className="w-5 h-5 text-rose-600 shrink-0" />,
    },
  };

  const { container, title: titleColor, defaultIcon } = typeConfig[type];

  return (
    <div
      role="alert"
      className={`rounded-xl border p-4 sm:p-5 flex items-start gap-3.5 transition-colors ${container} ${className}`.trim()}
      {...props}
    >
      <div className="mt-0.5 shrink-0">{icon || defaultIcon}</div>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`text-sm sm:text-base font-semibold tracking-tight ${titleColor}`}>
            {title}
          </h4>
        )}
        <div className={`text-sm leading-relaxed ${title ? 'mt-1 text-slate-700' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
