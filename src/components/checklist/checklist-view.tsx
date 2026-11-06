'use client';

import React, { useState, useMemo } from 'react';
import { Requirement, Service } from '@/types';
import { ChecklistItem } from './checklist-item';
import { ChecklistShareModal } from './checklist-share-modal';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import {
  CheckIcon,
  PrinterIcon,
  RotateCcwIcon,
  Share2Icon,
} from '@/components/ui/icons';
import { useLocalStorage } from '@/lib/storage/useStorage';
import {
  formatChecklistShareText,
  generateWhatsAppShareUrl,
} from '@/utils/share-formatter';

export interface ChecklistViewProps {
  service: Service;
  mandatoryRequirements: Requirement[];
  conditionalRequirements: Requirement[];
  reasonsByRequirementId?: Record<string, string[]>;
  conditions?: { questionTitle: string; answerLabel: string }[];
  shareableUrl?: string;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  service,
  mandatoryRequirements,
  conditionalRequirements,
  reasonsByRequirementId = {},
  conditions = [],
  shareableUrl,
}) => {
  const allRequirements = useMemo(
    () => [...mandatoryRequirements, ...conditionalRequirements],
    [mandatoryRequirements, conditionalRequirements]
  );
  const totalReqCount = allRequirements.length;

  const [storedChecked, setStoredChecked] = useLocalStorage<unknown>(
    `ceklayanan_checklist_${service.id}`,
    []
  );

  const checkedIds: string[] = useMemo(() => {
    if (Array.isArray(storedChecked)) {
      return storedChecked as string[];
    }
    if (
      storedChecked &&
      typeof storedChecked === 'object' &&
      'checkedIds' in storedChecked &&
      Array.isArray((storedChecked as { checkedIds: unknown[] }).checkedIds)
    ) {
      return (storedChecked as { checkedIds: string[] }).checkedIds;
    }
    return [];
  }, [storedChecked]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const reqCheckedCount = checkedIds.filter((id) =>
    allRequirements.some((r) => r.id === id)
  ).length;
  const isAllChecked = totalReqCount > 0 && reqCheckedCount === totalReqCount;

  const handleToggle = (id: string) => {
    const isAlreadyChecked = checkedIds.includes(id);
    const nextChecked = isAlreadyChecked
      ? checkedIds.filter((item) => item !== id)
      : [...checkedIds, id];

    setStoredChecked(nextChecked);
  };

  const handleReset = () => {
    setStoredChecked([]);
  };

  const handlePrint = () => {
    window.print();
  };

  const shareText = useMemo(() => {
    const effectiveUrl =
      shareableUrl || (typeof window !== 'undefined' ? window.location.href : undefined);
    return formatChecklistShareText({
      service,
      mandatoryRequirements,
      conditionalRequirements,
      checkedIds,
      conditions,
      appUrl: effectiveUrl,
    });
  }, [
    service,
    mandatoryRequirements,
    conditionalRequirements,
    checkedIds,
    conditions,
    shareableUrl,
  ]);

  const whatsappUrl = useMemo(() => {
    return generateWhatsAppShareUrl(shareText);
  }, [shareText]);

  return (
    <div className="space-y-5">
      {/* Progress Card Sederhana */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 no-print">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-sm sm:text-base font-bold text-slate-900">
            {isAllChecked
              ? 'Semua Dokumen Siap!'
              : `${reqCheckedCount} dari ${totalReqCount} Dokumen Siap`}
          </span>

          {reqCheckedCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-medium text-slate-500 hover:text-rose-600 inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcwIcon className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <ProgressBar
          current={reqCheckedCount}
          total={totalReqCount}
          showCount={false}
          variant={isAllChecked ? 'success' : 'primary'}
        />

        {isAllChecked && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900">
            <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dokumen sudah lengkap untuk dibawa ke {service.destinationAgency}.</span>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<PrinterIcon className="w-4 h-4" />}
          >
            Cetak / PDF
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsShareModalOpen(true)}
            leftIcon={<Share2Icon className="w-4 h-4" />}
          >
            Bagikan WA
          </Button>
        </div>
      </div>

      {/* Dokumen Wajib */}
      {mandatoryRequirements.length > 0 && (
        <div className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Dokumen Wajib ({mandatoryRequirements.length})
          </h2>
          {mandatoryRequirements.map((req) => (
            <ChecklistItem
              key={req.id}
              requirement={req}
              isChecked={checkedIds.includes(req.id)}
              onToggle={handleToggle}
              reasons={reasonsByRequirementId[req.id]}
            />
          ))}
        </div>
      )}

      {/* Dokumen Tambahan */}
      {conditionalRequirements.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 px-1">
            Dokumen Tambahan Sesuai Kondisi ({conditionalRequirements.length})
          </h2>
          {conditionalRequirements.map((req) => (
            <ChecklistItem
              key={req.id}
              requirement={req}
              isChecked={checkedIds.includes(req.id)}
              onToggle={handleToggle}
              reasons={reasonsByRequirementId[req.id]}
            />
          ))}
        </div>
      )}

      <ChecklistShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareText={shareText}
        whatsappUrl={whatsappUrl}
        serviceName={service.name}
      />

      <div className="hidden print-only mt-6 pt-4 border-t border-slate-300 text-xs text-slate-500 text-center">
        <p>Dicetak dari CekLayanan — Panduan Persyaratan Administrasi Publik</p>
      </div>
    </div>
  );
};
