'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Requirement, Service } from '@/types';
import { ChecklistItem } from './checklist-item';
import { CustomItemsSection } from './custom-items-section';
import { ChecklistShareModal } from './checklist-share-modal';
import { ServiceProcedureTimeline } from './service-procedure-timeline';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import {
  CheckIcon,
  PrinterIcon,
  RotateCcwIcon,
  ChevronLeftIcon,
  Share2Icon,
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
  conditions?: { questionTitle: string; answerLabel: string }[];
}

type FilterType = 'all' | 'pending' | 'completed';

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  service,
  mandatoryRequirements,
  conditionalRequirements,
  conditions = [],
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

  // Normalize to always guarantee a string[] array
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

  // Filter state
  const [filter, setFilter] = useState<FilterType>('all');

  // Share modal state
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
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh centang checklist ini?')) {
      setStoredChecked([]);
      setStoredCustomItems(customItems.map((item) => ({ ...item, isChecked: false })));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Handlers for Custom Items
  const handleAddCustomItem = (text: string) => {
    const newItem: CustomItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      text,
      isChecked: false,
    };
    setStoredCustomItems([...customItems, newItem]);
  };

  const handleToggleCustomItem = (id: string) => {
    const updated = customItems.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setStoredCustomItems(updated);
  };

  const handleDeleteCustomItem = (id: string) => {
    const updated = customItems.filter((item) => item.id !== id);
    setStoredCustomItems(updated);
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
    return formatChecklistShareText({
      service,
      mandatoryRequirements,
      conditionalRequirements,
      checkedIds,
      customItems,
      conditions,
      appUrl: typeof window !== 'undefined' ? window.location.href : undefined,
    });
  }, [service, mandatoryRequirements, conditionalRequirements, checkedIds, customItems, conditions]);

  const whatsappUrl = useMemo(() => {
    return generateWhatsAppShareUrl(shareText);
  }, [shareText]);

  return (
    <div className="space-y-8">
      {/* Progress & Quick Actions Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Status Kesiapan Dokumen & Perlengkapan
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAllCombinedChecked
                ? 'Semua Berkas & Perlengkapan Sudah Lengkap!'
                : `${totalCombinedChecked} dari ${totalCombinedCount} Siap Dibawa`}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Share / Copy Action */}
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
              leftIcon={<Share2Icon className="w-4 h-4" />}
            >
              Bagikan / Salin
            </Button>

            {/* Print Action */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<PrinterIcon className="w-4 h-4" />}
            >
              Cetak / PDF
            </Button>

            {/* Reset Action */}
            {totalCombinedChecked > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                leftIcon={<RotateCcwIcon className="w-4 h-4" />}
                className="text-slate-500 hover:text-rose-600"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        <ProgressBar
          current={totalCombinedChecked}
          total={totalCombinedCount}
          showCount={false}
          variant={isAllCombinedChecked ? 'success' : 'primary'}
        />

        {isAllOfficialChecked && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs sm:text-sm text-emerald-900">
            <CheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Bagus Sekali!</strong> Seluruh dokumen resmi Anda telah lengkap. Anda siap
              berangkat ke <strong>{service.destinationAgency}</strong>.
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/70 w-fit no-print">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua ({totalReqCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'pending'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Belum Siap ({totalReqCount - reqCheckedCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'completed'
              ? 'bg-white text-emerald-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sudah Siap ({reqCheckedCount})
        </button>
      </div>

      {/* Dokumen Wajib Section */}
      {filteredMandatory.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Dokumen Wajib
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Persyaratan mutlak yang harus dibawa oleh seluruh pemohon.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
              {filteredMandatory.length} Berkas
            </span>
          </div>

          <div className="space-y-3">
            {filteredMandatory.map((req) => (
              <ChecklistItem
                key={req.id}
                requirement={req}
                isChecked={checkedIds.includes(req.id)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Dokumen Tambahan / Kondisional Section */}
      {filteredConditional.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Dokumen Tambahan Sesuai Kondisi Anda
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Disesuaikan berdasarkan jawaban situasi yang Anda pilih sebelumnya.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              {filteredConditional.length} Berkas
            </span>
          </div>

          <div className="space-y-3">
            {filteredConditional.map((req) => (
              <ChecklistItem
                key={req.id}
                requirement={req}
                isChecked={checkedIds.includes(req.id)}
                onToggle={handleToggle}
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
              ? '🎉 Selamat! Tidak ada dokumen resmi yang belum siap.'
              : 'Belum ada dokumen yang dicentang siap.'}
          </p>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
          >
            Tampilkan Semua Dokumen
          </button>
        </div>
      )}

      {/* Custom Items Section (Perlengkapan Tambahan Pribadi) */}
      <CustomItemsSection
        items={customItems}
        onAddItem={handleAddCustomItem}
        onToggleItem={handleToggleCustomItem}
        onDeleteItem={handleDeleteCustomItem}
      />

      {/* Service Procedure Timeline (Alur & Tahapan Pengurusan di Loket) */}
      <ServiceProcedureTimeline service={service} />

      {/* Action to change conditions & Print */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <Link
          href={`/layanan/${service.slug}/questions`}
          className="text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span>Ubah Jawaban Kondisi Sebelumnya</span>
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setIsShareModalOpen(true)}
            leftIcon={<Share2Icon className="w-4 h-4" />}
            className="flex-1 sm:flex-none"
          >
            Bagikan
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handlePrint}
            leftIcon={<PrinterIcon className="w-5 h-5" />}
            className="flex-1 sm:flex-none"
          >
            Cetak Lembar Checklist
          </Button>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ChecklistShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareText={shareText}
        whatsappUrl={whatsappUrl}
        serviceName={service.name}
      />

      {/* Print-Only Header & Footer */}
      <div className="hidden print-only mt-8 pt-6 border-t border-slate-300 text-xs text-slate-500 text-center">
        <p>Dicetak dari CekLayanan — Panduan Persyaratan Administrasi Publik Mandiri</p>
        <p>Pastikan berkas asli dan fotokopi dimasukkan ke dalam map sebelum berangkat ke kantor pelayanan.</p>
      </div>
    </div>
  );
};
