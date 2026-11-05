'use client';

import React, { useState, useMemo } from 'react';
import { Requirement, Service } from '@/types';
import { ChecklistItem } from './checklist-item';
import { CustomItemsSection } from './custom-items-section';
import { ChecklistShareModal } from './checklist-share-modal';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import {
  CheckIcon,
  PrinterIcon,
  RotateCcwIcon,
  Share2Icon,
  PlusIcon,
} from '@/components/ui/icons';
import { useLocalStorage } from '@/lib/storage/useStorage';
import {
  CustomItem,
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

type FilterType = 'all' | 'pending' | 'completed';

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

  // Hydration-safe checked state from LocalStorage
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

  // Custom user items in LocalStorage
  const [storedCustomItems, setStoredCustomItems] = useLocalStorage<unknown>(
    `ceklayanan_custom_items_${service.id}`,
    []
  );

  const customItems: CustomItem[] = useMemo(() => {
    if (Array.isArray(storedCustomItems)) {
      return storedCustomItems as CustomItem[];
    }
    return [];
  }, [storedCustomItems]);

  const [filter, setFilter] = useState<FilterType>('all');
  const [showCustomSection, setShowCustomSection] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Counters
  const reqCheckedCount = checkedIds.filter((id) =>
    allRequirements.some((r) => r.id === id)
  ).length;
  const customCheckedCount = customItems.filter((item) => item.isChecked).length;
  const totalCombinedCount = totalReqCount + customItems.length;
  const totalCombinedChecked = reqCheckedCount + customCheckedCount;

  const isAllOfficialChecked = totalReqCount > 0 && reqCheckedCount === totalReqCount;
  const isAllCombinedChecked =
    totalCombinedCount > 0 && totalCombinedChecked === totalCombinedCount;

  // Handlers for Official Requirements
  const handleToggle = (id: string) => {
    const isAlreadyChecked = checkedIds.includes(id);
    const nextChecked = isAlreadyChecked
      ? checkedIds.filter((item) => item !== id)
      : [...checkedIds, id];

    setStoredChecked(nextChecked);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ceklayanan-progress-updated'));
    }
  };

  const handleCheckAllOfficial = () => {
    const allIds = allRequirements.map((r) => r.id);
    setStoredChecked(allIds);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ceklayanan-progress-updated'));
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset seluruh tanda centang pada daftar ini?')) {
      setStoredChecked([]);
      setStoredCustomItems(customItems.map((item) => ({ ...item, isChecked: false })));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('ceklayanan-progress-updated'));
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Handlers for Custom Items
  const handleAddCustomItem = (text: string) => {
    const newItem: CustomItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text,
      isChecked: false,
    };
    setStoredCustomItems([...customItems, newItem]);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ceklayanan-progress-updated'));
    }
  };

  const handleToggleCustomItem = (id: string) => {
    const updated = customItems.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setStoredCustomItems(updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ceklayanan-progress-updated'));
    }
  };

  const handleDeleteCustomItem = (id: string) => {
    const updated = customItems.filter((item) => item.id !== id);
    setStoredCustomItems(updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ceklayanan-progress-updated'));
    }
  };

  // Filtered requirements
  const filteredMandatory = useMemo(() => {
    if (filter === 'all') return mandatoryRequirements;
    if (filter === 'completed') {
      return mandatoryRequirements.filter((req) => checkedIds.includes(req.id));
    }
    return mandatoryRequirements.filter((req) => !checkedIds.includes(req.id));
  }, [mandatoryRequirements, checkedIds, filter]);

  const filteredConditional = useMemo(() => {
    if (filter === 'all') return conditionalRequirements;
    if (filter === 'completed') {
      return conditionalRequirements.filter((req) => checkedIds.includes(req.id));
    }
    return conditionalRequirements.filter((req) => !checkedIds.includes(req.id));
  }, [conditionalRequirements, checkedIds, filter]);

  // Formatted share text for WhatsApp and Clipboard
  const shareText = useMemo(() => {
    const effectiveUrl =
      shareableUrl || (typeof window !== 'undefined' ? window.location.href : undefined);
    return formatChecklistShareText({
      service,
      mandatoryRequirements,
      conditionalRequirements,
      checkedIds,
      customItems,
      conditions,
      appUrl: effectiveUrl,
    });
  }, [
    service,
    mandatoryRequirements,
    conditionalRequirements,
    checkedIds,
    customItems,
    conditions,
    shareableUrl,
  ]);

  const whatsappUrl = useMemo(() => {
    return generateWhatsAppShareUrl(shareText);
  }, [shareText]);

  return (
    <div className="space-y-6">
      {/* Unified Progress & Toolbar Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {isAllCombinedChecked
                  ? 'Semua Dokumen Siap Dibawa!'
                  : `${totalCombinedChecked} dari ${totalCombinedCount} Dokumen Siap`}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Centang berkas yang sudah Anda masukkan ke dalam map. Tersimpan otomatis di HP/laptop Anda.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
              leftIcon={<Share2Icon className="w-4 h-4" />}
            >
              Simpan / Bagikan WA
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<PrinterIcon className="w-4 h-4" />}
            >
              Cetak PDF
            </Button>
          </div>
        </div>

        <ProgressBar
          current={totalCombinedChecked}
          total={totalCombinedCount}
          showCount={false}
          variant={isAllCombinedChecked ? 'success' : 'primary'}
        />

        {/* Ready Banner */}
        {isAllOfficialChecked && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs sm:text-sm text-emerald-900">
            <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Siap Berangkat!</strong> Seluruh dokumen persyaratan untuk{' '}
              <strong>{service.destinationAgency}</strong> sudah lengkap.
            </span>
          </div>
        )}

        {/* Filter Bar + Quick Bulk Actions */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({totalReqCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                filter === 'pending'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Belum Siap ({totalReqCount - reqCheckedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                filter === 'completed'
                  ? 'bg-white text-emerald-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sudah Siap ({reqCheckedCount})
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {!isAllOfficialChecked && totalReqCount > 0 && (
              <button
                type="button"
                onClick={handleCheckAllOfficial}
                className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Centang Semua
              </button>
            )}
            {totalCombinedChecked > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="font-semibold text-slate-500 hover:text-rose-600 inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcwIcon className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dokumen Wajib Section */}
      {filteredMandatory.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Dokumen Wajib ({filteredMandatory.length})
            </h3>
            <span className="text-xs text-slate-400 no-print">
              Bawa Asli &amp; Fotokopi 2x
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredMandatory.map((req) => (
              <ChecklistItem
                key={req.id}
                requirement={req}
                isChecked={checkedIds.includes(req.id)}
                onToggle={handleToggle}
                reasons={reasonsByRequirementId[req.id]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Dokumen Tambahan / Kondisional Section */}
      {filteredConditional.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Dokumen Sesuai Kondisi Anda ({filteredConditional.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {filteredConditional.map((req) => (
              <ChecklistItem
                key={req.id}
                requirement={req}
                isChecked={checkedIds.includes(req.id)}
                onToggle={handleToggle}
                reasons={reasonsByRequirementId[req.id]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State when filter yields 0 */}
      {filteredMandatory.length === 0 && filteredConditional.length === 0 && (
        <div className="py-8 text-center rounded-2xl border border-dashed border-slate-200 bg-white p-6 no-print">
          <p className="text-sm text-slate-600 font-medium">
            {filter === 'pending'
              ? 'Semua dokumen resmi sudah Anda centang siap!'
              : 'Belum ada dokumen yang dicentang siap.'}
          </p>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
          >
            Tampilkan Semua Dokumen
          </button>
        </div>
      )}

      {/* Compact Custom Personal Notes Section */}
      {customItems.length > 0 || showCustomSection ? (
        <CustomItemsSection
          items={customItems}
          onAddItem={handleAddCustomItem}
          onToggleItem={handleToggleCustomItem}
          onDeleteItem={handleDeleteCustomItem}
        />
      ) : (
        <div className="no-print">
          <button
            type="button"
            onClick={() => setShowCustomSection(true)}
            className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-300 hover:border-blue-400 bg-white/60 hover:bg-blue-50/30 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Tambah Catatan Perlengkapan Pribadi (Map, Pasfoto, Pulpen, dll.)</span>
          </button>
        </div>
      )}

      {/* Share Modal Dialog */}
      <ChecklistShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareText={shareText}
        whatsappUrl={whatsappUrl}
        serviceName={service.name}
      />

      {/* Print-Only Footer */}
      <div className="hidden print-only mt-8 pt-6 border-t border-slate-300 text-xs text-slate-500 text-center">
        <p>Dicetak dari CekLayanan — Panduan Persyaratan Administrasi Publik Mandiri</p>
        <p>Pastikan berkas asli dan fotokopi dimasukkan ke dalam map sebelum berangkat ke kantor pelayanan.</p>
      </div>
    </div>
  );
};
