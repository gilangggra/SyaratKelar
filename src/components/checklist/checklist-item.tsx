import React from 'react';
import { Requirement } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from '@/components/ui/icons';

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
    </div>
  );
};
