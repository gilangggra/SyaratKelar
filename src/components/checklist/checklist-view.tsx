'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Requirement, Service } from '@/types';
import { ChecklistItem } from './checklist-item';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import {
  CheckIcon,
  PrinterIcon,
  RotateCcwIcon,
  ChevronLeftIcon,
} from '@/components/ui/icons';
import {
  saveChecklistState,
  getChecklistState,
  clearChecklistState,
} from '@/lib/storage/checklistStorage';

export interface ChecklistViewProps {
  service: Service;
  mandatoryRequirements: Requirement[];
  conditionalRequirements: Requirement[];
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  service,
  mandatoryRequirements,
  conditionalRequirements,
}) => {
  const allRequirements = [...mandatoryRequirements, ...conditionalRequirements];
  const totalCount = allRequirements.length;

  // Initialize checked state from LocalStorage
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = getChecklistState(service.id);
      if (saved && Array.isArray(saved)) {
        return saved;
      }
    }
    return [];
  });

  const checkedCount = checkedIds.length;
  const isAllChecked = totalCount > 0 && checkedCount === totalCount;

  const handleToggle = (id: string) => {
    setCheckedIds((prev) => {
      const isAlreadyChecked = prev.includes(id);
      const next = isAlreadyChecked
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      saveChecklistState(service.id, next);
      return next;
    });
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh centang checklist ini?')) {
      setCheckedIds([]);
      clearChecklistState(service.id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Progress & Quick Actions Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Status Kesiapan Dokumen
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isAllChecked
                ? 'Semua Dokumen Sudah Siap!'
                : `${checkedCount} dari ${totalCount} Dokumen Siap`}
            </h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<PrinterIcon className="w-4 h-4" />}
            >
              Cetak / Simpan PDF
            </Button>

            {checkedCount > 0 && (
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
          current={checkedCount}
          total={totalCount}
          showCount={false}
          variant={isAllChecked ? 'success' : 'primary'}
        />

        {isAllChecked && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs sm:text-sm text-emerald-900">
            <CheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Bagus!</strong> Seluruh berkas persyaratan Anda telah lengkap. Anda siap
              berangkat ke {service.destinationAgency}.
            </span>
          </div>
        )}
      </div>

      {/* Dokumen Wajib Section */}
      {mandatoryRequirements.length > 0 && (
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
              {mandatoryRequirements.length} Berkas
            </span>
          </div>

          <div className="space-y-3">
            {mandatoryRequirements.map((req) => (
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
      {conditionalRequirements.length > 0 && (
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
              {conditionalRequirements.length} Berkas
            </span>
          </div>

          <div className="space-y-3">
            {conditionalRequirements.map((req) => (
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

      {/* Action to change conditions */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <Link
          href={`/layanan/${service.slug}/questions`}
          className="text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span>Ubah Jawaban Kondisi Sebelumnya</span>
        </Link>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handlePrint}
          leftIcon={<PrinterIcon className="w-5 h-5" />}
        >
          Cetak Lembar Checklist Ini
        </Button>
      </div>

      {/* Print-Only Header & Footer */}
      <div className="hidden print-only mt-8 pt-6 border-t border-slate-300 text-xs text-slate-500 text-center">
        <p>Dicetak dari CekLayanan — Panduan Persyaratan Administrasi Publik Mandiri</p>
        <p>Pastikan berkas asli dan fotokopi dimasukkan ke dalam map sebelum berangkat ke kantor pelayanan.</p>
      </div>
    </div>
  );
};
