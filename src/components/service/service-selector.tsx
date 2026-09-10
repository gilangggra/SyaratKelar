'use client';

import React from 'react';
import { INITIAL_SERVICES, ServiceSummary } from '@/data/services';
import { Badge } from '@/components/ui/badge';
import { ChevronRightIcon, FileTextIcon } from '@/components/ui/icons';

export interface ServiceSelectorProps {
  selectedServiceId?: string;
  onSelectService?: (service: ServiceSummary) => void;
  className?: string;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedServiceId,
  onSelectService,
  className = '',
}) => {
  return (
    <div className={`space-y-2.5 ${className}`.trim()}>
      {INITIAL_SERVICES.map((service) => {
        const isSelected = selectedServiceId === service.id;

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelectService?.(service)}
            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              isSelected
                ? 'bg-blue-50/80 border-blue-500 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <FileTextIcon className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900 text-sm sm:text-base leading-snug truncate">
                    {service.name}
                  </span>
                  <Badge variant={service.isFree ? 'free' : 'neutral'} size="sm">
                    {service.officialFeeText}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {service.destinationAgency} &bull; {service.categoryLabel}
                </p>
              </div>
            </div>

            <ChevronRightIcon
              className={`w-5 h-5 shrink-0 transition-transform ${
                isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-400'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
