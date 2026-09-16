import React from 'react';
import Link from 'next/link';
import { Requirement } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, FileTextIcon, ExternalLinkIcon } from '@/components/ui/icons';

export interface ChecklistItemProps {
  requirement: Requirement;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  requirement,
  isChecked,
  onToggle,
}) => {
  return (
    <div className="relative">
      <Checkbox
        id={`req-${requirement.id}`}
        checked={isChecked}
        onChange={() => onToggle(requirement.id)}
        label={requirement.title}
        description={requirement.description}
        badge={
          <Badge
            variant={requirement.isMandatory ? 'default' : 'neutral'}
            size="sm"
          >
            {requirement.isMandatory ? 'Wajib' : 'Kondisional'}
          </Badge>
        }
      />

      {/* Notes / Peringatan Dokumen */}
      {requirement.notes && (
        <div className="ml-11 sm:ml-12 mt-1 mb-2.5 flex items-start gap-1.5 text-xs text-slate-500 leading-relaxed">
          <InfoIcon className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-700">Catatan:</strong> {requirement.notes}
          </span>
        </div>
      )}

      {/* Template Generator Link */}
      {requirement.templateAvailable && requirement.templateId && (
        <div className="ml-11 sm:ml-12 mt-2 mb-2 no-print">
          <Link
            href={`/template/${requirement.templateId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition-colors shadow-2xs group"
          >
            <FileTextIcon className="w-3.5 h-3.5 text-blue-600 group-hover:scale-105 transition-transform" />
            <span>Buat Surat Ini Mandiri (Template Resmi Tersedia)</span>
            <ExternalLinkIcon className="w-3 h-3 text-blue-500 ml-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
