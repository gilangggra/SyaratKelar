import React, { LabelHTMLAttributes, forwardRef } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  subLabel?: string;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required = false, subLabel, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-0.5 mb-1.5">
        <label
          ref={ref}
          className={`text-sm font-semibold text-slate-800 flex items-center gap-1 ${className}`.trim()}
          {...props}
        >
          <span>{children}</span>
          {required && <span className="text-rose-500 font-bold" title="Wajib diisi">*</span>}
        </label>
        {subLabel && <span className="text-xs text-slate-500">{subLabel}</span>}
      </div>
    );
  }
);

Label.displayName = 'Label';
