import React from 'react';
import Link from 'next/link';
import { ServiceSummary } from '@/data/services';
import { ChevronRightIcon } from '@/components/ui/icons';

interface ServiceCardProps {
  service: ServiceSummary;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Link
      href={`/layanan/${service.slug}`}
      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-blue-500 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            {service.officialFeeText}
          </span>
          <span className="text-[11px] text-slate-400 truncate">
            {service.categoryLabel}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-1.5">
          {service.name}
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {service.shortDescription}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 truncate max-w-[140px]">
          {service.destinationAgency}
        </span>

        <span className="inline-flex items-center gap-0.5 font-semibold text-blue-600 shrink-0">
          <span>Cek Syarat</span>
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
};
