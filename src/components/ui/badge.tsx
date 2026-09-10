import React, { HTMLAttributes } from 'react';
import { AlertTriangleIcon, CheckIcon, ShieldCheckIcon } from './icons';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'needs_verification'
  | 'free';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-sm px-3 py-1 font-medium',
  };

  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    free: 'bg-emerald-100/80 text-emerald-800 border border-emerald-300 font-semibold',
    needs_verification: 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md shrink-0 select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {variant === 'needs_verification' && (
        <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
      )}
      {variant === 'free' && <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
      {variant === 'success' && <CheckIcon className="w-3 h-3 text-emerald-700 shrink-0" />}
      <span>{variant === 'needs_verification' && !children ? 'NEEDS_VERIFICATION' : children}</span>
    </span>
  );
};
