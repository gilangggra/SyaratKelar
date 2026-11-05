'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Service, UserAnswers } from '@/types';
import {
  resolveRequirements,
  getActiveQuestions,
  sanitizeAnswersForActiveQuestions,
} from '@/lib/rules/engine';
import { useLocalStorage } from '@/lib/storage/useStorage';
import { saveUserAnswers } from '@/lib/storage/answerStorage';
import { ChecklistView } from './checklist-view';
import { Badge } from '@/components/ui/badge';
import { ServiceProcedureTimeline } from './service-procedure-timeline';
import { ServicePitfalls } from '@/components/service/service-pitfalls';
import { ServiceFaqAccordion } from '@/components/service/service-faq';
import {
  Building2Icon,
  ShieldCheckIcon,
  ClockIcon,
  FileTextIcon,
} from '@/components/ui/icons';

export interface HasilContainerProps {
  service: Service;
}

type CompanionTab = 'panduan' | 'peringatan' | 'faq';

export const HasilContainer: React.FC<HasilContainerProps> = ({ service }) => {
  const defaultAnswers = React.useMemo(() => {
    const fallback: UserAnswers = {};
    (service.questions || []).forEach((q) => {
      if (q.defaultValue) fallback[q.id] = q.defaultValue;
    });
    return fallback;
  }, [service.questions]);

  const [storedAnswers, setStoredAnswers] = useLocalStorage<UserAnswers>(
    `ceklayanan_answers_${service.id}`,
    defaultAnswers
  );

  const [isEditingInline, setIsEditingInline] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<CompanionTab>('panduan');

  // Sync URL query params (if user opened a shared link with ?questionId=value)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlAnswers: UserAnswers = {};
    let hasValidUrlAnswer = false;

    for (const q of service.questions || []) {
      const paramVal = params.get(q.id);
      if (paramVal && q.options.some((opt) => opt.value === paramVal)) {
        urlAnswers[q.id] = paramVal;
        hasValidUrlAnswer = true;
      }
    }

    if (hasValidUrlAnswer) {
      const merged = sanitizeAnswersForActiveQuestions(service, {
        ...defaultAnswers,
        ...(storedAnswers || {}),
        ...urlAnswers,
      });
      saveUserAnswers(service.id, merged);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service.id]);

  // Safe active answers
  const safeAnswers = React.useMemo(() => {
    const merged =
      storedAnswers && typeof storedAnswers === 'object'
        ? { ...defaultAnswers, ...storedAnswers }
        : defaultAnswers;
    return sanitizeAnswersForActiveQuestions(service, merged);
  }, [service, storedAnswers, defaultAnswers]);

  const activeQuestions = React.useMemo(
    () => getActiveQuestions(service, safeAnswers),
    [service, safeAnswers]
  );

  // Resolve requirements, reasons, and physical summary via Rule Engine v2
  const resolved = React.useMemo(
    () => resolveRequirements(service, safeAnswers),
    [service, safeAnswers]
  );

  const { preparationSummary } = resolved;

  // Build shareable URL with current condition parameters
  const shareableUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const url = new URL(window.location.href);
    url.search = '';
    Object.entries(safeAnswers).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
    return url.toString();
  }, [safeAnswers]);

  // Identify answered conditions summary for active questions
  const conditionSummaries: { questionId: string; questionTitle: string; answerLabel: string }[] = [];
  activeQuestions.forEach((q) => {
    const ansVal = safeAnswers[q.id];
    if (ansVal) {
      const matchedOpt = q.options.find((opt) => opt.value === ansVal);
      if (matchedOpt) {
        conditionSummaries.push({
          questionId: q.id,
          questionTitle: q.title,
          answerLabel: matchedOpt.label,
        });
      }
    }
  });

  const handleInlineOptionChange = (questionId: string, newValue: string) => {
    const nextRaw = { ...safeAnswers, [questionId]: newValue };
    const sanitized = sanitizeAnswersForActiveQuestions(service, nextRaw);
    setStoredAnswers(sanitized);
    saveUserAnswers(service.id, sanitized);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.search = '';
      Object.entries(sanitized).forEach(([k, v]) => {
        if (v) url.searchParams.set(k, v);
      });
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Unified Service & Preparation Summary Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={service.fees.isFree ? 'free' : 'neutral'} size="md">
              {service.fees.isFree ? 'Resmi Gratis Rp0' : 'Sesuai Tarif Resmi'}
            </Badge>
            <Badge variant="neutral" size="md">
              {service.categoryLabel}
            </Badge>
          </div>
          {service.fees.legalReference && (
            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>{service.fees.legalReference}</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {service.name}
        </h1>

        {/* Agency & Time Metadata */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-5 text-xs sm:text-sm text-slate-600 mt-2.5">
          <div className="flex items-center gap-1.5">
            <Building2Icon className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Tujuan: <strong className="text-slate-900">{service.destinationAgency}</strong>
            </span>
          </div>
          {service.estimatedTime && (
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Estimasi: <strong className="text-slate-900">{service.estimatedTime}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Selected Conditions & Quick Switcher */}
        {conditionSummaries.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kondisi Anda:
              </span>
              <button
                type="button"
                onClick={() => setIsEditingInline((prev) => !prev)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 no-print cursor-pointer"
              >
                {isEditingInline ? 'Selesai Ubah Kondisi' : 'Ubah Kondisi'}
              </button>
            </div>

            {!isEditingInline ? (
              <div className="flex flex-wrap gap-2">
                {conditionSummaries.map((cond) => (
                  <button
                    key={cond.questionId}
                    type="button"
                    onClick={() => setIsEditingInline(true)}
                    title={`Klik untuk mengubah: ${cond.questionTitle}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors text-left cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>{cond.answerLabel}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3.5 no-print">
                {activeQuestions.map((q, qIdx) => (
                  <div key={q.id} className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      {qIdx + 1}. {q.title}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => {
                        const isSelected = safeAnswers[q.id] === opt.value;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleInlineOptionChange(q.id, opt.value)}
                            className={`text-left text-xs p-2.5 rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Compact Physical Preparation Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Dokumen</span>
            <strong className="text-sm sm:text-base font-bold text-slate-900">
              {preparationSummary.totalDocuments} Berkas
            </strong>
            <span className="text-[11px] text-slate-500 block">Asli &amp; Fotokopi 2x</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block">Materai Rp10.000</span>
            <strong
              className={`text-sm sm:text-base font-bold ${
                preparationSummary.materaiCount > 0 ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {preparationSummary.materaiCount > 0
                ? `${preparationSummary.materaiCount} Lembar`
                : 'Tidak Perlu'}
            </strong>
            <span className="text-[11px] text-slate-500 block">
              {preparationSummary.materaiCount > 0 ? 'Siapkan dari rumah' : 'Bebas materai'}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block">Surat Mandiri</span>
            <strong className="text-sm sm:text-base font-bold text-slate-900">
              {preparationSummary.templatesAvailableCount > 0
                ? `${preparationSummary.templatesAvailableCount} Template`
                : 'Blangko Loket'}
            </strong>
            <span className="text-[11px] text-slate-500 block">
              {preparationSummary.templatesAvailableCount > 0
                ? 'Bisa dicetak di bawah'
                : 'Diisi di kantor dinas'}
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block">Kehadiran</span>
            <strong
              className={`text-sm sm:text-base font-bold ${
                preparationSummary.requiresInPerson ? 'text-amber-700' : 'text-slate-900'
              }`}
            >
              {preparationSummary.requiresInPerson ? 'Wajib Sendiri' : 'Pemohon / KK'}
            </strong>
            <span className="text-[11px] text-slate-500 block">
              {preparationSummary.requiresInPerson ? 'Rekam biometrik' : 'Bawa KTP asli'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary Interactive Checklist */}
      <ChecklistView
        service={service}
        mandatoryRequirements={resolved.mandatory}
        conditionalRequirements={resolved.conditional}
        reasonsByRequirementId={resolved.reasonsByRequirementId}
        conditions={conditionSummaries}
        shareableUrl={shareableUrl}
      />

      {/* 3. Clean Tabbed Companion Guide (Menggantikan tumpukan kartu panjang) */}
      <div className="pt-4 no-print">
        <div className="flex items-center gap-1.5 border-b border-slate-200 mb-5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveGuideTab('panduan')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeGuideTab === 'panduan'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Alur di Kantor Pelayanan
          </button>

          {service.pitfalls && service.pitfalls.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveGuideTab('peringatan')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeGuideTab === 'peringatan'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Hal Penting Agar Tidak Ditolak ({service.pitfalls.length})
            </button>
          )}

          {service.faqs && service.faqs.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveGuideTab('faq')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeGuideTab === 'faq'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Tanya Jawab Umum ({service.faqs.length})
            </button>
          )}
        </div>

        {activeGuideTab === 'panduan' && <ServiceProcedureTimeline service={service} />}

        {activeGuideTab === 'peringatan' && service.pitfalls && (
          <ServicePitfalls pitfalls={service.pitfalls} />
        )}

        {activeGuideTab === 'faq' && service.faqs && (
          <ServiceFaqAccordion faqs={service.faqs} />
        )}
      </div>

      {/* 4. Compact Related Services Footer */}
      {service.relatedServiceSlugs && service.relatedServiceSlugs.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2.5">
            <FileTextIcon className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              Sering diurus bersamaan dengan layanan ini:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {service.relatedServiceSlugs.map((relSlug) => (
              <Link
                key={relSlug}
                href={`/layanan/${relSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-xs font-semibold text-slate-800 hover:text-blue-700 transition-colors capitalize"
              >
                <span>{relSlug.replace(/-/g, ' ')}</span>
                <span>&rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
