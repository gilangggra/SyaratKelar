import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getServiceBySlug, INITIAL_SERVICES } from '@/data/services';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServicePitfalls } from '@/components/service/service-pitfalls';
import { ServiceFaqAccordion } from '@/components/service/service-faq';
import {
  Building2Icon,
  ChevronLeftIcon,
  ClockIcon,
  ExternalLinkIcon,
  FileTextIcon,
  ShieldCheckIcon,
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

  // Resolve base mandatory requirements for quick preview
  const baseRequirements = service.allRequirements.filter((r) =>
    service.baseRequirementIds.includes(r.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Back Link */}
        <div className="mb-5">
          <Link
            href="/layanan"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Semua Layanan</span>
          </Link>
        </div>

        {/* Service Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={service.fees.isFree ? 'free' : 'neutral'} size="md">
                {service.fees.isFree ? 'Biaya Resmi: Gratis Rp0' : 'Berbayar Sesuai Ketentuan'}
              </Badge>
              <Badge variant="neutral" size="md">
                {service.categoryLabel}
              </Badge>
            </div>
            {service.fees.legalReference && (
              <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>{service.fees.legalReference}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2.5">
            {service.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
            {service.fullDescription || service.shortDescription}
          </p>

          {/* Agency & Time Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                <Building2Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Lokasi Pengurusan:</span>
                <strong className="text-slate-900">{service.destinationAgency}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
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

          {/* Primary & Direct CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
                Cek Syarat Sesuai Kondisi Saya
              </Button>
            </Link>

            <Link
              href={`/layanan/${service.slug}/hasil`}
              className="w-full sm:w-auto"
            >
              <Button variant="outline" size="lg" fullWidth>
                Langsung Buka Checklist
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Jawab {service.questions.length} pertanyaan singkat (&plusmn;30 detik) agar dokumen tambahan disesuaikan tepat dengan situasi Anda.
          </p>
        </div>

        {/* Quick Base Requirements Preview */}
        {baseRequirements.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs mb-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-base font-bold text-slate-900">
                Dokumen Wajib Dasar ({baseRequirements.length} Berkas)
              </h2>
              <span className="text-xs text-slate-500">
                Belum termasuk dokumen sesuai kondisi khusus
              </span>
            </div>
            <ul className="divide-y divide-slate-100">
              {baseRequirements.map((req) => (
                <li key={req.id} className="py-2.5 flex items-start gap-2.5 text-sm">
                  <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-slate-800">{req.title}</strong>
                    {req.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{req.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pitfalls / Peringatan Kesalahan Umum */}
        {service.pitfalls && service.pitfalls.length > 0 && (
          <div className="mb-6">
            <ServicePitfalls pitfalls={service.pitfalls} />
          </div>
        )}

        {/* Counter FAQ / Tanya Jawab Seputar Loket */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="mb-6">
            <ServiceFaqAccordion faqs={service.faqs} />
          </div>
        )}

        {/* Verified Sources / References */}
        {service.sources && service.sources.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Dasar Hukum &amp; Rujukan Resmi
            </h3>
            <ul className="divide-y divide-slate-100 text-sm">
              {service.sources.map((src) => (
                <li key={src.id} className="py-2 flex items-start justify-between gap-3">
                  <div>
                    <strong className="text-slate-800 font-semibold text-xs sm:text-sm block">
                      {src.title}
                    </strong>
                    <span className="text-xs text-slate-500 block">
                      {src.sourceName}
                      {src.legalBasis ? ` • ${src.legalBasis}` : ''}
                    </span>
                  </div>

                  {src.sourceUrl && (
                    <a
                      href={src.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0"
                    >
                      <span>Rujukan</span>
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
