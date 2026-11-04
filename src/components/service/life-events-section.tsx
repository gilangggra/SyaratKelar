'use client';

import React from 'react';
import Link from 'next/link';
import { LIFE_EVENT_BUNDLES } from '@/data/services';
import { saveUserAnswers } from '@/lib/storage/answerStorage';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon } from '@/components/ui/icons';

export const LifeEventsSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 block mb-2">
          Panduan Terpadu Lintas Layanan
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Urutan Mengurus Dokumen Berdasarkan Peristiwa
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Banyak urusan administrasi saling berkaitan. Ikuti urutan yang tepat di bawah ini agar
          Anda tidak ditolak di loket karena dokumen prasyarat belum diurus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LIFE_EVENT_BUNDLES.map((bundle) => (
          <div
            key={bundle.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant="default" size="sm">
                  {bundle.badgeText}
                </Badge>
                <span className="text-xs font-medium text-slate-500">{bundle.subtitle}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{bundle.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                {bundle.description}
              </p>

              {/* Step-by-Step Sequence */}
              <div className="space-y-3">
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
                      className="group flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-200 transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs group-hover:bg-blue-700">
                        {step.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {step.serviceName}
                          </h4>
                          <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {step.roleDescription}
                        </p>
                      </div>
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

