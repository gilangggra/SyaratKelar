import React from 'react';
import Link from 'next/link';
import { ServiceSummary } from '@/data/services';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2Icon, ChevronRightIcon, FileTextIcon } from '@/components/ui/icons';

interface ServiceCardProps {
  service: ServiceSummary;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Link
      href={`/layanan/${service.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl"
    >
      <Card
        interactive
        className="h-full flex flex-col p-5 sm:p-6 transition-all group-hover:border-blue-400 group-hover:shadow-md"
      >
        {/* Top Badges & Agency */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={service.isFree ? 'free' : 'neutral'} size="sm">
            {service.officialFeeText}
          </Badge>
          <span className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
            {service.categoryLabel}
          </span>
        </div>

        {/* Title */}
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileTextIcon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
            {service.name}
          </h3>
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
          {service.shortDescription}
        </p>

        {/* Footer info: Destination & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto">
          <div className="flex items-center gap-1.5 truncate">
            <Building2Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{service.destinationAgency}</span>
          </div>

          <span className="inline-flex items-center gap-1 font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
            <span>Cek Syarat</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
};
