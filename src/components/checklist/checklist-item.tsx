import React from 'react';
import Link from 'next/link';
import { Requirement } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, FileTextIcon, ExternalLinkIcon, ArrowRightIcon } from '@/components/ui/icons';

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
  const needsMaterai =
    requirement.requiresMaterai ??
    (requirement.title.toLowerCase().includes('materai') ||
      requirement.title.toLowerCase().includes('sptjm'));

  return (
    <div className="relative">
      <Checkbox
        id={`req-${requirement.id}`}
        checked={isChecked}
        onChange={() => onToggle(requirement.id)}
        label={requirement.title}
        description={requirement.description}
        badge={
          <div className="flex flex-wrap items-center gap-1.5">
            {needsMaterai && (
              <Badge variant="warning" size="sm">
                Materai Rp10.000
              </Badge>
            )}
            <Badge
              variant={requirement.isMandatory ? 'default' : 'neutral'}
              size="sm"
            >
              {requirement.isMandatory ? 'Wajib' : 'Sesuai Kondisi'}
            </Badge>
          </div>
        }
      />

      {/* Explainable Rule Reason (Mengapa dokumen ini muncul) */}
      {reasons.length > 0 && (
        <div className="ml-11 sm:ml-12 mt-1.5 mb-1.5 flex flex-wrap items-center gap-1.5">
          {reasons.map((reason, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80"
            >
              <span>Ditambahkan karena:</span>
              <strong className="font-semibold">{reason}</strong>
            </span>
          ))}
        </div>
      )}

      {/* Notes / Peringatan Dokumen */}
      {requirement.notes && (
        <div className="ml-11 sm:ml-12 mt-1 mb-2 flex items-start gap-1.5 text-xs text-slate-500 leading-relaxed">
          <InfoIcon className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-700">Catatan:</strong> {requirement.notes}
          </span>
        </div>
      )}

      {/* Action Links: Template Generator & Prerequisite Service */}
      {((requirement.templateAvailable && requirement.templateId) ||
        (requirement.prerequisiteServiceSlug && requirement.prerequisiteServiceLabel)) && (
        <div className="ml-11 sm:ml-12 mt-2 mb-2.5 flex flex-wrap items-center gap-2 no-print">
          {requirement.templateAvailable && requirement.templateId && (
            <Link
              href={`/template/${requirement.templateId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition-colors shadow-2xs group"
            >
              <FileTextIcon className="w-3.5 h-3.5 text-blue-600 group-hover:scale-105 transition-transform" />
              <span>Buat Surat Ini Mandiri (Template Siap Cetak)</span>
              <ExternalLinkIcon className="w-3 h-3 text-blue-500 ml-0.5" />
            </Link>
          )}

          {requirement.prerequisiteServiceSlug && requirement.prerequisiteServiceLabel && (
            <Link
              href={`/layanan/${requirement.prerequisiteServiceSlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80 hover:text-slate-900 transition-colors"
            >
              <span>Belum punya dokumen ini? {requirement.prerequisiteServiceLabel}</span>
              <ArrowRightIcon className="w-3 h-3 text-slate-500" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
