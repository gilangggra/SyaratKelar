'use client';

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { getAllConfiguredServices } from '@/data/services';
import { resolveRequirements, sanitizeAnswersForActiveQuestions } from '@/lib/rules/engine';
import { UserAnswers } from '@/types';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon, CheckIcon, Trash2Icon } from '@/components/ui/icons';

interface ActiveServiceProgress {
  serviceId: string;
  slug: string;
  name: string;
  destinationAgency: string;
  checkedCount: number;
  totalCount: number;
  queryString: string;
}

function computeActiveProgressSnapshot(): string {
  if (typeof window === 'undefined') return '[]';
  const services = getAllConfiguredServices();
  const results: ActiveServiceProgress[] = [];

  for (const service of services) {
    try {
      const rawChecklist = localStorage.getItem(`ceklayanan_checklist_${service.id}`);
      const rawCustom = localStorage.getItem(`ceklayanan_custom_items_${service.id}`);
      const rawAnswers = localStorage.getItem(`ceklayanan_answers_${service.id}`);

      let checkedIds: string[] = [];
      if (rawChecklist) {
        const parsed = JSON.parse(rawChecklist);
        if (Array.isArray(parsed)) {
          checkedIds = parsed;
        } else if (parsed && Array.isArray(parsed.checkedIds)) {
          checkedIds = parsed.checkedIds;
        }
      }

      let customItems: { isChecked?: boolean }[] = [];
      if (rawCustom) {
        const parsedCustom = JSON.parse(rawCustom);
        if (Array.isArray(parsedCustom)) {
          customItems = parsedCustom;
        }
      }

      if (checkedIds.length === 0 && customItems.length === 0) {
        continue;
      }

      const defaultAnswers: UserAnswers = {};
      service.questions.forEach((q) => {
        if (q.defaultValue) defaultAnswers[q.id] = q.defaultValue;
      });

      let userAnswers = defaultAnswers;
      if (rawAnswers) {
        const parsedAns = JSON.parse(rawAnswers);
        if (parsedAns && typeof parsedAns === 'object') {
          userAnswers = sanitizeAnswersForActiveQuestions(service, {
            ...defaultAnswers,
            ...parsedAns,
          });
        }
      }

      const resolved = resolveRequirements(service, userAnswers);
      const validCheckedCount =
        checkedIds.filter((id) => resolved.all.some((r) => r.id === id)).length +
        customItems.filter((c) => c.isChecked).length;
      const totalCount = resolved.all.length + customItems.length;

      if (totalCount > 0 && (validCheckedCount > 0 || customItems.length > 0)) {
        const params = new URLSearchParams();
        Object.entries(userAnswers).forEach(([k, v]) => {
          if (v) params.set(k, v);
        });

        results.push({
          serviceId: service.id,
          slug: service.slug,
          name: service.name,
          destinationAgency: service.destinationAgency,
          checkedCount: validCheckedCount,
          totalCount,
          queryString: params.toString(),
        });
      }
    } catch {
      // Ignore malformed localStorage entries
    }
  }

  return JSON.stringify(results);
}

function getServerProgressSnapshot(): string {
  return '[]';
}

function subscribeActiveProgress(callback: () => void): () => void {
  window.addEventListener('storage', callback);
  window.addEventListener('ceklayanan-progress-updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('ceklayanan-progress-updated', callback);
  };
}

export const ActiveChecklistsBanner: React.FC = () => {
  const rawSnapshot = useSyncExternalStore(
    subscribeActiveProgress,
    computeActiveProgressSnapshot,
    getServerProgressSnapshot
  );

  let activeList: ActiveServiceProgress[] = [];
  try {
    activeList = JSON.parse(rawSnapshot) as ActiveServiceProgress[];
  } catch {
    activeList = [];
  }

  const handleClearProgress = (serviceId: string, name: string) => {
    if (window.confirm(`Hapus riwayat persiapan checklist untuk ${name}?`)) {
      localStorage.removeItem(`ceklayanan_checklist_${serviceId}`);
      localStorage.removeItem(`ceklayanan_custom_items_${serviceId}`);
      window.dispatchEvent(new Event('ceklayanan-progress-updated'));
    }
  };

  if (activeList.length === 0) {
    return null;
  }

  return (
    <div className="mb-10 rounded-2xl border border-blue-200 bg-blue-50/50 p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            Tersimpan di Perangkat Anda
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Lanjutkan Persiapan Dokumen Anda
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          {activeList.length} layanan sedang disiapkan
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeList.map((item) => {
          const isComplete = item.checkedCount === item.totalCount;
          const targetHref = `/layanan/${item.slug}/hasil${
            item.queryString ? `?${item.queryString}` : ''
          }`;

          return (
            <div
              key={item.serviceId}
              className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between gap-3 shadow-2xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Link
                    href={targetHref}
                    className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-base"
                  >
                    {item.name}
                  </Link>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant={isComplete ? 'free' : 'default'} size="sm">
                      {isComplete
                        ? 'Siap Berangkat'
                        : `${item.checkedCount}/${item.totalCount} Siap`}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleClearProgress(item.serviceId, item.name)}
                      title="Hapus dari daftar persiapan aktif"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                      aria-label={`Hapus persiapan ${item.name}`}
                    >
                      <Trash2Icon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Tujuan: {item.destinationAgency}
                </p>

                <ProgressBar
                  current={item.checkedCount}
                  total={item.totalCount}
                  showCount={false}
                  variant={isComplete ? 'success' : 'primary'}
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  {isComplete ? (
                    <>
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Semua berkas siap</span>
                    </>
                  ) : (
                    <span>Kurang {item.totalCount - item.checkedCount} berkas lagi</span>
                  )}
                </span>

                <Link
                  href={targetHref}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <span>Lanjutkan Checklist</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
