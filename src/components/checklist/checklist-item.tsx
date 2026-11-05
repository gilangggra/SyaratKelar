import React, { useId } from 'react';
import Link from 'next/link';
import { Requirement } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  CheckIcon,
  InfoIcon,
  FileTextIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
} from '@/components/ui/icons';

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
  reasons = [],
}) => {
  const generatedId = useId();
  const inputId = `req-${requirement.id}-${generatedId}`;

  const needsMaterai =
    requirement.requiresMaterai ??
    (requirement.title.toLowerCase().includes('materai') ||
      requirement.title.toLowerCase().includes('sptjm'));

  const hasActions =
    (requirement.templateAvailable && requirement.templateId) ||
    (requirement.prerequisiteServiceSlug && requirement.prerequisiteServiceLabel);

  return (
    <div
      className={`group rounded-xl border transition-all ${
        isChecked
          ? 'bg-emerald-50/40 border-emerald-200/90'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
      }`}
    >
      {/* Main Clickable Area for Checkbox */}
      <label
        htmlFor={inputId}
        className="flex items-start gap-3.5 p-4 sm:p-5 cursor-pointer select-none"
      >
        <input
          type="checkbox"
          id={inputId}
          checked={isChecked}
          onChange={() => onToggle(requirement.id)}
          className="sr-only peer"
        />

        {/* Custom Checkbox Indicator */}
        <div
          className={`shrink-0 w-6 h-6 mt-0.5 rounded-lg border-2 flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 ${
            isChecked
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-slate-300 bg-white group-hover:border-blue-500'
          }`}
          aria-hidden="true"
        >
          {isChecked && <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />}
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Title & Badges Row */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <span
              className={`text-base font-bold leading-snug transition-colors ${
                isChecked ? 'line-through text-slate-400' : 'text-slate-900'
              }`}
            >
              {requirement.title}
            </span>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {needsMaterai && (
                <Badge variant="warning" size="sm">
                  Materai Rp10.000
                </Badge>
              )}
              {isChecked ? (
                <Badge variant="free" size="sm">
                  Sudah Siap
                </Badge>
              ) : (
                <Badge variant={requirement.isMandatory ? 'default' : 'neutral'} size="sm">
                  {requirement.isMandatory ? 'Wajib' : 'Sesuai Kondisi'}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {requirement.description && (
            <p
              className={`text-sm mt-1 leading-relaxed ${
                isChecked ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {requirement.description}
            </p>
          )}

          {/* Explainable Reason & Notes inside the unified card */}
          {(reasons.length > 0 || requirement.notes) && !isChecked && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-1.5">
              {reasons.length > 0 && (
                <p className="text-xs text-blue-700 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  <span>Diminta karena: {reasons.join(' & ')}</span>
                </p>
              )}

              {requirement.notes && (
                <div className="flex items-start gap-1.5 text-xs text-slate-500 leading-relaxed">
                  <InfoIcon className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{requirement.notes}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </label>

      {/* Action Footer (Template Generator / Prerequisite Link) */}
      {hasActions && (
        <div
          className={`px-4 sm:px-5 pb-4 pt-0 pl-14 sm:pl-14 flex flex-wrap items-center gap-2 no-print ${
            isChecked ? 'opacity-75' : ''
          }`}
        >
          {requirement.templateAvailable && requirement.templateId && (
            <Link
              href={`/template/${requirement.templateId}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <FileTextIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Isi &amp; Cetak Template Surat Ini</span>
              <ExternalLinkIcon className="w-3 h-3 text-blue-500 ml-0.5" />
            </Link>
          )}

          {requirement.prerequisiteServiceSlug && requirement.prerequisiteServiceLabel && (
            <Link
              href={`/layanan/${requirement.prerequisiteServiceSlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80 transition-colors"
            >
              <span>{requirement.prerequisiteServiceLabel}</span>
              <ArrowRightIcon className="w-3 h-3 text-slate-500" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
