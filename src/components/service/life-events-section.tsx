'use client';

import React from 'react';
import Link from 'next/link';
import { LIFE_EVENT_BUNDLES } from '@/data/services';
import { saveUserAnswers } from '@/lib/storage/answerStorage';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon } from '@/components/ui/icons';

export const LifeEventsSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-14 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Paket Panduan Berurutan
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Bingung Urutan Mengurus Dokumen?
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Pilih peristiwa di bawah ini untuk langsung membuka checklist sesuai urutan instansi yang benar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {LIFE_EVENT_BUNDLES.map((bundle) => (
          <div
            key={bundle.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {bundle.title}
                </h3>
                <Badge variant="default" size="sm">
                  {bundle.badgeText}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {bundle.description}
              </p>

              {/* Compact Step Sequence */}
              <div className="space-y-2">
                {bundle.steps.map((step) => {
                  const params = new URLSearchParams();
                  if (step.presetAnswers) {
                    Object.entries(step.presetAnswers).forEach(([k, v]) => {
                      if (v) params.set(k, v);
                    });
                  }
                  const qs = params.toString();
                  const href = `/layanan/${step.serviceSlug}/hasil${qs ? `?${qs}` : ''}`;

                  return (
                    <Link
                      key={step.order}
                      href={href}
                      onClick={() => {
                        if (step.presetAnswers) {
                          saveUserAnswers(step.serviceSlug, step.presetAnswers);
                        }
                      }}
                      className="group flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-200 transition-all"
                    >
                      <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {step.order}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate">
                          {step.serviceName}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                          {step.roleDescription}
                        </p>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
