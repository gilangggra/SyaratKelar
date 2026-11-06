import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getServiceBySlug, INITIAL_SERVICES } from '@/data/services';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2Icon,
  ChevronLeftIcon,
  ClockIcon,
  ExternalLinkIcon,
  FileTextIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@/components/ui/icons';

interface PageProps {
  params: Promise<{ serviceId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { serviceId } = await params;
  const service =
    getServiceBySlug(serviceId) ||
    INITIAL_SERVICES.find((s) => s.slug === serviceId || s.id === serviceId);

  if (!service) {
    return {
      title: 'Layanan Tidak Ditemukan — CekLayanan',
    };
  }

  return {
    title: `${service.name} — Cek Persyaratan | CekLayanan`,
    description: service.shortDescription,
  };
}

export default async function ServiceOverviewPage({ params }: PageProps) {
  const { serviceId } = await params;
  const configuredService = getServiceBySlug(serviceId);
  const summaryService = INITIAL_SERVICES.find(
    (s) => s.slug === serviceId || s.id === serviceId
  );

  if (!summaryService && !configuredService) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <FileTextIcon className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Layanan tidak ditemukan</h1>
          <div className="mt-6">
            <Link href="/layanan">
              <Button variant="primary">Kembali ke Daftar Layanan</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const service = configuredService!;
  const baseRequirements = service.allRequirements.filter((r) =>
    service.baseRequirementIds.includes(r.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
        </div>

        {/* Kartu Utama Layanan */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 mb-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="free" size="sm">
              Biaya Resmi: Gratis Rp0
            </Badge>
            <Badge variant="neutral" size="sm">
              {service.categoryLabel}
            </Badge>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            {service.name}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            {service.shortDescription}
          </p>

          <div className="space-y-2 py-3.5 border-y border-slate-100 text-xs sm:text-sm text-slate-700 mb-5">
            <div className="flex items-center gap-2.5">
              <Building2Icon className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Lokasi: <strong>{service.destinationAgency}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ClockIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Estimasi: <strong>{service.estimatedTime || '1 - 3 hari kerja'}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link href={`/layanan/${service.slug}/questions`} className="flex-1">
              <Button
                variant="primary"
                size="md"
                fullWidth
                rightIcon={<ArrowRightIcon className="w-4 h-4" />}
              >
                Mulai Cek Persyaratan
              </Button>
            </Link>

            <Link href={`/layanan/${service.slug}/hasil`}>
              <Button variant="outline" size="md" fullWidth>
                Langsung ke Checklist
              </Button>
            </Link>
          </div>
        </div>

        {/* Ringkasan Dokumen Dasar */}
        {baseRequirements.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 mb-5">
            <h2 className="text-sm font-bold text-slate-900 mb-3">
              Dokumen Wajib Dasar:
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {baseRequirements.map((req) => (
                <li key={req.id} className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req.title}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              *Dokumen tambahan akan disesuaikan setelah Anda menjawab pertanyaan kondisi.
            </p>
          </div>
        )}

        {/* Dasar Hukum Singkat */}
        {service.sources && service.sources.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
            <span className="font-bold text-slate-800 block mb-1.5">Dasar Hukum Resmi:</span>
            <ul className="space-y-1.5">
              {service.sources.map((src) => (
                <li key={src.id} className="flex items-center justify-between gap-2">
                  <span>
                    {src.title} {src.legalBasis ? `(${src.legalBasis})` : ''}
                  </span>
                  {src.sourceUrl && (
                    <a
                      href={src.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1 shrink-0"
                    >
                      <span>Sumber</span>
                      <ExternalLinkIcon className="w-3 h-3" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
