import React, { useId } from 'react';
import Link from 'next/link';
import { Requirement } from '@/types';
import { CheckIcon, FileTextIcon } from '@/components/ui/icons';

export interface ChecklistItemProps {
  requirement: Requirement;
  isChecked: boolean;
  onToggle: (id: string) => void;
  reasons?: string[];
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  requirement,
  isChecked,
  onToggle,
}) => {
  const generatedId = useId();
  const inputId = `req-${requirement.id}-${generatedId}`;

  return (
    <div
      className={`rounded-xl border transition-colors ${
        isChecked
          ? 'bg-emerald-50/40 border-emerald-200'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <label
        htmlFor={inputId}
        className="flex items-start gap-3 p-3.5 sm:p-4 cursor-pointer select-none"
      >
        <input
          type="checkbox"
          id={inputId}
          checked={isChecked}
          onChange={() => onToggle(requirement.id)}
          className="sr-only peer"
        />

        <div
          className={`shrink-0 w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 ${
            isChecked
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-slate-300 bg-white'
          }`}
          aria-hidden="true"
        >
          {isChecked && <CheckIcon className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
        </div>

        <div className="flex-1 min-w-0">
          <span
            className={`text-sm sm:text-base font-semibold block leading-snug ${
              isChecked ? 'line-through text-slate-400' : 'text-slate-900'
            }`}
          >
            {requirement.title}
          </span>

          {requirement.description && !isChecked && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              {requirement.description}
            </p>
          )}

          {requirement.notes && !isChecked && (
            <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
              Catatan: {requirement.notes}
            </p>
          )}
        </div>
      </label>

      {requirement.templateAvailable && requirement.templateId && !isChecked && (
        <div className="px-4 pb-3.5 pl-11 no-print">
          <Link
            href={`/template/${requirement.templateId}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <FileTextIcon className="w-3.5 h-3.5" />
            <span>Buat Surat Ini</span>
          </Link>
        </div>
      )}
    </div>
  );
};
