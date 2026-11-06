'use client';

import React, { useEffect } from 'react';
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
import { Building2Icon, InfoIcon } from '@/components/ui/icons';

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

  const [storedAnswers] = useLocalStorage<UserAnswers>(
    `ceklayanan_answers_${service.id}`,
    defaultAnswers
  );

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

  const resolved = React.useMemo(
    () => resolveRequirements(service, safeAnswers),
    [service, safeAnswers]
  );

  const shareableUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const url = new URL(window.location.href);
    url.search = '';
    Object.entries(safeAnswers).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
    return url.toString();
  }, [safeAnswers]);

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

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header Ringkas */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="free" size="sm">
            Biaya Resmi: Gratis Rp0
          </Badge>
          <span className="text-xs text-slate-500">
            {service.fees.legalReference}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          {service.name}
        </h1>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 mt-1.5">
          <Building2Icon className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Lokasi: <strong>{service.destinationAgency}</strong>
          </span>
        </div>

        {conditionSummaries.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-500">
                Kondisi Anda:
              </span>
              <Link
                href={`/layanan/${service.slug}/questions`}
                className="text-xs font-semibold text-blue-600 hover:underline no-print"
              >
                Ubah Kondisi
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {conditionSummaries.map((cond) => (
                <span
                  key={cond.questionId}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {cond.answerLabel}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Checklist Utama */}
      <ChecklistView
        service={service}
        mandatoryRequirements={resolved.mandatory}
        conditionalRequirements={resolved.conditional}
        reasonsByRequirementId={resolved.reasonsByRequirementId}
        conditions={conditionSummaries}
        shareableUrl={shareableUrl}
      />

      {/* Catatan Singkat Sebelum Berangkat */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed no-print">
        <InfoIcon className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800 block mb-0.5">Tips Sebelum Berangkat:</strong>
          Bawa dokumen asli beserta salinan fotokopi (minimal 2 lembar) di dalam map rapi.
          {resolved.preparationSummary.materaiCount > 0 && (
            <span>
              {' '}Siapkan juga <strong>{resolved.preparationSummary.materaiCount} lembar Materai Rp10.000</strong> untuk surat pernyataan.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
