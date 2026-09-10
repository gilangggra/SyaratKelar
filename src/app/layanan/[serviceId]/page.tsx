import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getServiceBySlug, INITIAL_SERVICES } from '@/data/services';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import {
  Building2Icon,
  ChevronLeftIcon,
  ClockIcon,
  ExternalLinkIcon,
  FileTextIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
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
        <main className="flex-1 max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <FileTextIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Layanan tidak tersedia</h1>
          <p className="mt-2 text-slate-600">
            Layanan yang Anda cari belum tersedia atau alamat tidak sesuai. Silakan kembali ke daftar
            layanan.
          </p>
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

  const service = configuredService || {
    id: summaryService!.id,
    slug: summaryService!.slug,
    name: summaryService!.name,
    shortDescription: summaryService!.shortDescription,
    category: summaryService!.category,
    categoryLabel: summaryService!.categoryLabel,
    destinationAgency: summaryService!.destinationAgency,
    fees: {
      isFree: summaryService!.isFree,
      officialAmount: 0,
      currency: 'IDR' as const,
      description: summaryService!.isFree
        ? 'Layanan ini GRATIS (Rp0) sesuai ketentuan perundang-undangan resmi.'
        : 'Sesuai tarif resmi yang berlaku.',
      legalReference: 'UU Administrasi Kependudukan No. 24 Tahun 2013',
    },
    sources: [
      {
        id: 'default-source',
        title: 'Undang-Undang No. 24 Tahun 2013',
        sourceName: 'JDIH Kemendagri',
        sourceUrl: 'https://peraturan.go.id',
        verifiedAt: '2026-01-15',
        legalBasis: 'Pasal 79A',
      },
    ],
    questions: [],
    rules: [],
    baseRequirementIds: [],
    allRequirements: [],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/layanan"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors min-h-[44px]"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Kembali ke Semua Layanan</span>
          </Link>
        </div>

        {/* Service Header Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant={service.fees.isFree ? 'free' : 'neutral'} size="md">
              {service.fees.isFree ? 'Gratis Rp0' : 'Berbayar'}
            </Badge>
            <Badge variant="neutral" size="md">
              {service.categoryLabel}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
            {service.name}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed mb-6">
            {service.shortDescription}
          </p>

          {/* Agency & Time Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-100 text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Building2Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Instansi Pelayanan:</span>
                <strong className="text-slate-900">{service.destinationAgency}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Estimasi Proses:</span>
                <strong className="text-slate-900">
                  {service.estimatedTime || '1 - 3 hari kerja'}
                </strong>
              </div>
            </div>
          </div>

          {/* CTA Action */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={`/layanan/${service.slug}/questions`}
              className="w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRightIcon className="w-5 h-5" />}
              >
                Mulai Cek Persyaratan Saya
              </Button>
            </Link>

            <span className="text-xs text-slate-500 text-center sm:text-left">
              Memerlukan waktu &plusmn; 1 menit untuk menjawab kondisi Anda.
            </span>
          </div>
        </div>

        {/* Fee Transparency Box */}
        <div className="mb-8">
          <Alert
            type="success"
            title="Transparansi Biaya Resmi: Bebas Biaya (Rp0)"
            icon={<ShieldCheckIcon className="w-5 h-5 text-emerald-600" />}
          >
            <p className="mt-1">
              {service.fees.description}
            </p>
            {service.fees.legalReference && (
              <p className="mt-1.5 text-xs text-emerald-800 font-medium">
                Dasar Hukum: {service.fees.legalReference}
              </p>
            )}
          </Alert>
        </div>

        {/* Verified Sources / References */}
        {service.sources && service.sources.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
              Rujukan Regulasi & Sumber Resmi
            </h3>
            <ul className="divide-y divide-slate-100 text-sm">
              {service.sources.map((src) => (
                <li key={src.id} className="py-2.5 flex items-start justify-between gap-3">
                  <div>
                    <strong className="text-slate-900 block">{src.title}</strong>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Sumber: {src.sourceName}
                      {src.legalBasis && ` &bull; ${src.legalBasis}`}
                    </span>
                  </div>

                  {src.sourceUrl && (
                    <a
                      href={src.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0 pt-0.5"
                    >
                      <span>Lihat Aturan</span>
                      <ExternalLinkIcon className="w-3.5 h-3.5" />
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
