import React, { InputHTMLAttributes, forwardRef, useId } from 'react';
import { CheckIcon } from './icons';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, description, badge, checked, disabled, className = '', onChange, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <label
        htmlFor={inputId}
        className={`group relative flex items-start p-3 sm:p-4 rounded-xl border transition-all cursor-pointer select-none min-h-[52px] ${
          checked
            ? 'bg-blue-50/60 border-blue-300 text-blue-950 shadow-2xs'
            : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`.trim()}
      >
        {/* Native Hidden Checkbox for full Accessibility */}
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="sr-only peer"
          {...props}
        />

        {/* Big Touch-friendly Custom Checkbox Box (44px target via parent container, 24px visual box) */}
        <div
          className={`shrink-0 w-6 h-6 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 ${
            checked
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-slate-300 bg-white group-hover:border-slate-400'
          }`}
          aria-hidden="true"
        >
          {checked && <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />}
        </div>

        {/* Text Container */}
        <div className="ml-3.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-base font-semibold leading-snug transition-colors ${
                checked ? 'line-through text-slate-500' : 'text-slate-900'
              }`}
            >
              {label}
            </span>
            {badge && <span className="inline-flex shrink-0">{badge}</span>}
          </div>

          {description && (
            <p
              className={`text-sm mt-1 leading-relaxed ${
                checked ? 'text-slate-400 line-through' : 'text-slate-600'
              }`}
            >
              {description}
            </p>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
