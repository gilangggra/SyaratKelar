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
import { Alert } from '@/components/ui/alert';
import { ServicePitfalls } from '@/components/service/service-pitfalls';
import { ServiceFaqAccordion } from '@/components/service/service-faq';
import {
  Building2Icon,
  ShieldCheckIcon,
  InfoIcon,
  ClockIcon,
  FileTextIcon,
} from '@/components/ui/icons';

export interface HasilContainerProps {
  service: Service;
}

export const HasilContainer: React.FC<HasilContainerProps> = ({ service }) => {
  const defaultAnswers = React.useMemo(() => {
    const fallback: UserAnswers = {};
    (service.questions || []).forEach((q) => {
      if (q.defaultValue) fallback[q.id] = q.defaultValue;
    });
    return fallback;
  }, [service.questions]);

  // Persistent answers from LocalStorage (so answers survive browser restart!)
  const [storedAnswers, setStoredAnswers] = useLocalStorage<UserAnswers>(
    `ceklayanan_answers_${service.id}`,
    defaultAnswers
  );

  // Toggle inline quick condition editor
  const [isEditingInline, setIsEditingInline] = useState(false);

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

    // Update URL query string without page reload
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
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant={service.fees.isFree ? 'free' : 'neutral'} size="md">
            {service.fees.isFree ? 'Gratis Rp0' : 'Biaya Resmi Sesuai Ketentuan'}
          </Badge>
          <Badge variant="neutral" size="md">
            {service.categoryLabel}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
          Daftar Persyaratan: {service.name}
        </h1>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-600 mt-3">
          <div className="flex items-center gap-2">
            <Building2Icon className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Lokasi Pengurusan: <strong className="text-slate-900">{service.destinationAgency}</strong>
            </span>
          </div>
          {service.estimatedTime && (
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Estimasi: <strong className="text-slate-900">{service.estimatedTime}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Selected Conditions & Inline Condition Switcher */}
        {conditionSummaries.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kondisi Pengajuan Anda ({conditionSummaries.length} Kondisi Aktif):
              </span>
              <div className="flex items-center gap-3 no-print">
                <button
                  type="button"
                  onClick={() => setIsEditingInline((prev) => !prev)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 cursor-pointer"
                >
                  {isEditingInline ? 'Tutup Ubah Cepat' : 'Ubah Kondisi Cepat di Sini'}
                </button>
                <span className="text-slate-300">|</span>
                <Link
                  href={`/layanan/${service.slug}/questions`}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600"
                >
                  Ulangi Kuis
                </Link>
              </div>
            </div>

            {!isEditingInline ? (
              <div className="flex flex-wrap gap-2">
                {conditionSummaries.map((cond) => (
                  <button
                    key={cond.questionId}
                    type="button"
                    onClick={() => setIsEditingInline(true)}
                    title={`Klik untuk mengubah: ${cond.questionTitle}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:border-blue-200 text-slate-700 border border-slate-200 transition-colors text-left cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    <span>{cond.answerLabel}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-4 no-print">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-blue-900">
                    Sesuaikan kondisi di bawah ini untuk melihat perubahan syarat secara instan:
                  </p>
                </div>
                <div className="space-y-3">
                  {activeQuestions.map((q, qIdx) => (
                    <div key={q.id} className="bg-white p-3.5 rounded-lg border border-slate-200">
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
                                  ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-2xs'
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
              </div>
            )}
          </div>
        )}
      </div>

      {/* Physical Folder & Preparation Summary Card (Kalkulator Kebutuhan Map Fisik) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Total Dokumen
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {preparationSummary.totalDocuments} <span className="text-sm font-semibold text-slate-500">Berkas</span>
          </p>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            Siapkan asli &amp; fotokopi 2x
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Kebutuhan Materai
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {preparationSummary.materaiCount > 0 ? (
              <>
                {preparationSummary.materaiCount}{' '}
                <span className="text-sm font-semibold text-amber-700">Lembar</span>
              </>
            ) : (
              <span className="text-emerald-700 text-base sm:text-lg">Tidak Perlu</span>
            )}
          </p>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            {preparationSummary.materaiCount > 0
              ? 'Materai tempel Rp10.000'
              : 'Bebas surat bermaterai'}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Template Mandiri
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {preparationSummary.templatesAvailableCount > 0 ? (
              <>
                {preparationSummary.templatesAvailableCount}{' '}
                <span className="text-sm font-semibold text-blue-600">Formulir</span>
              </>
            ) : (
              <span className="text-slate-600 text-base sm:text-lg">Di Loket</span>
            )}
          </p>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            {preparationSummary.templatesAvailableCount > 0
              ? 'Bisa diisi & cetak di sini'
              : 'Blangko tersedia di dinas'}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Kehadiran Fisik
          </span>
          <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1.5">
            {preparationSummary.requiresInPerson ? (
              <span className="text-amber-700">Wajib Hadir Sendiri</span>
            ) : (
              <span className="text-slate-800">Pemohon / Anggota KK</span>
            )}
          </p>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            {preparationSummary.requiresInPerson
              ? 'Tidak dapat diwakilkan'
              : 'Sesuai aturan loket'}
          </span>
        </div>
      </div>

      {/* Official Fee Reminder Banner */}
      <Alert
        type="success"
        title="Biaya Resmi: Rp0 (Bebas Pungutan)"
        icon={<ShieldCheckIcon className="w-5 h-5 text-emerald-600" />}
      >
        <p className="mt-1">{service.fees.description}</p>
        {service.fees.legalReference && (
          <p className="mt-1 text-xs text-emerald-800 font-medium">
            Rujukan: {service.fees.legalReference}
          </p>
        )}
      </Alert>

      {/* Tips Sebelum Berangkat */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 sm:p-5 no-print">
        <div className="flex items-start gap-3">
          <InfoIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900 block mb-1">
              Panduan Map Berkas Sebelum Berangkat ke {service.destinationAgency}:
            </strong>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>
                Masukkan <strong>dokumen asli</strong> dan <strong>fotokopi minimal 2 rangkap</strong> ke dalam satu map rapi.
              </li>
              {preparationSummary.materaiCount > 0 && (
                <li>
                  Siapkan <strong>{preparationSummary.materaiCount} lembar Materai Rp10.000</strong> untuk surat pernyataan mandiri (tanda tangan harus menyentuh materai).
                </li>
              )}
              <li>Bawa pulpen tinta hitam untuk keperluan pengisian formulir fisik di loket.</li>
              <li>Datang pada pagi hari jam pelayanan (umumnya pukul 08.00 - 14.00 waktu setempat).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Checklist Component */}
      <ChecklistView
        service={service}
        mandatoryRequirements={resolved.mandatory}
        conditionalRequirements={resolved.conditional}
        reasonsByRequirementId={resolved.reasonsByRequirementId}
        conditions={conditionSummaries}
        shareableUrl={shareableUrl}
      />

      {/* Pitfalls / Peringatan Penting di Loket */}
      {service.pitfalls && service.pitfalls.length > 0 && (
        <div className="no-print pt-2">
          <ServicePitfalls pitfalls={service.pitfalls} />
        </div>
      )}

      {/* Counter FAQ / Tanya Jawab Loket */}
      {service.faqs && service.faqs.length > 0 && (
        <div className="no-print pt-2">
          <ServiceFaqAccordion faqs={service.faqs} />
        </div>
      )}

      {/* Related Services Cross-Navigation */}
      {service.relatedServiceSlugs && service.relatedServiceSlugs.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs no-print">
          <div className="flex items-center gap-2 mb-2">
            <FileTextIcon className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Layanan Terkait yang Sering Diurus Bersamaan
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            Pastikan Anda juga memeriksa persyaratan dokumen terkait berikut agar tidak perlu bolak-balik kantor pelayanan:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {service.relatedServiceSlugs.map((relSlug) => (
              <Link
                key={relSlug}
                href={`/layanan/${relSlug}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-xs sm:text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors"
              >
                <span className="capitalize">{relSlug.replace(/-/g, ' ')}</span>
                <span>&rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
