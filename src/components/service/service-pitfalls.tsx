import React from 'react';
import { ServicePitfall } from '@/types';
import { AlertTriangleIcon } from '@/components/ui/icons';

export interface ServicePitfallsProps {
  pitfalls?: ServicePitfall[];
}

export const ServicePitfalls: React.FC<ServicePitfallsProps> = ({ pitfalls }) => {
  if (!pitfalls || pitfalls.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-7 shadow-xs">
      <div className="flex items-start gap-3.5 mb-5 pb-4 border-b border-amber-200/60">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <AlertTriangleIcon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
            Panduan Anti-Tolak
          </span>
          <h3 className="text-lg font-bold text-amber-950 tracking-tight">
            Peringatan Penting & Kesalahan yang Sering Terjadi di Loket
          </h3>
          <p className="text-xs sm:text-sm text-amber-800/90 mt-0.5">
            Perhatikan hal-hal berikut sebelum berangkat agar proses di loket langsung beres tanpa bolak-balik.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {pitfalls.map((pitfall, index) => (
          <div
            key={pitfall.id || index}
            className="rounded-xl border border-amber-200/80 bg-white/90 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {pitfall.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">
                {pitfall.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
