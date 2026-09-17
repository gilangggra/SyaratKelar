'use client';

import React, { useState } from 'react';
import { ServiceFaq } from '@/types';
import { ChevronRightIcon, InfoIcon } from '@/components/ui/icons';

export interface ServiceFaqProps {
  faqs?: ServiceFaq[];
}

export const ServiceFaqAccordion: React.FC<ServiceFaqProps> = ({ faqs }) => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(faqs && faqs.length > 0 ? [faqs[0].id] : []));

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
      <div className="flex items-start gap-3.5 mb-5 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
          <InfoIcon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
            Informasi Praktis
          </span>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Tanya Jawab Seputar Loket (FAQ)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pertanyaan yang paling sering ditanyakan warga saat mengurus dokumen ini.
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {faqs.map((faq) => {
          const isOpen = openIds.has(faq.id);

          return (
            <div key={faq.id} className="py-3.5 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between gap-3 text-left group focus:outline-hidden"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {faq.question}
                </span>
                <span
                  className={`w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-90 text-blue-600 bg-blue-50' : ''
                  }`}
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="mt-2.5 pr-8 animate-in fade-in-50 duration-150">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
