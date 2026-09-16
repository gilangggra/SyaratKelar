'use client';

import React from 'react';
import Link from 'next/link';
import { Service, UserAnswers } from '@/types';
import { resolveRequirements } from '@/lib/rules/engine';
import { useSessionStorage } from '@/lib/storage/useStorage';
import { ChecklistView } from './checklist-view';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import {
  Building2Icon,
  ShieldCheckIcon,
  InfoIcon,
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

  // Hydration-safe answers from session storage
  const [answers] = useSessionStorage<UserAnswers>(
    `ceklayanan_answers_${service.id}`,
    defaultAnswers
  );

  // Resolve requirements based on answers safely
  const safeAnswers = answers && typeof answers === 'object' ? answers : defaultAnswers;
  const resolved = resolveRequirements(service, safeAnswers);

  // Identify answered conditions summary
  const conditionSummaries: { questionTitle: string; answerLabel: string }[] = [];
  (service.questions || []).forEach((q) => {
    const ansVal = safeAnswers[q.id];
    if (ansVal) {
      const matchedOpt = q.options.find((opt) => opt.value === ansVal);
      if (matchedOpt) {
        conditionSummaries.push({
          questionTitle: q.title,
          answerLabel: matchedOpt.label,
        });
      }
    }
  });

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

        <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
          <Building2Icon className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Lokasi Pengurusan: <strong>{service.destinationAgency}</strong></span>
        </div>

        {/* Selected Conditions Pills */}
        {conditionSummaries.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kondisi Pengajuan Anda:
              </span>
              <Link
                href={`/layanan/${service.slug}/questions`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 no-print"
              >
                Ubah Kondisi
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {conditionSummaries.map((cond, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {cond.answerLabel}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Official Fee Reminder Banner */}
      <Alert
        type="success"
        title="Biaya Resmi: Rp0 (Bebas Pungutan)"
        icon={<ShieldCheckIcon className="w-5 h-5 text-emerald-600" />}
      >
        <p className="mt-1">
          {service.fees.description}
        </p>
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
            <strong className="text-slate-900 block mb-1">Tips Sebelum Berangkat ke Loket:</strong>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Bawa dokumen asli serta salinan fotokopi (minimal 2 lembar per dokumen).</li>
              <li>Bawa pulpen tinta hitam untuk keperluan pengisian blangko fisik di loket.</li>
              <li>Pastikan datang pada jam kerja pelayanan (umumnya 08.00 - 15.00 WIB).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Checklist Component */}
      <ChecklistView
        service={service}
        mandatoryRequirements={resolved.mandatory}
        conditionalRequirements={resolved.conditional}
        conditions={conditionSummaries}
      />
    </div>
  );
};
