import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getServiceBySlug, INITIAL_SERVICES } from '@/data/services';
import { HasilContainer } from '@/components/checklist/hasil-container';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, FileTextIcon } from '@/components/ui/icons';

interface HasilPageProps {
  params: Promise<{ serviceId: string }>;
}

export async function generateMetadata({ params }: HasilPageProps) {
  const { serviceId } = await params;
  const service = getServiceBySlug(serviceId);

  return {
    title: service
      ? `Checklist Persyaratan: ${service.name} — CekLayanan`
      : 'Checklist Persyaratan — CekLayanan',
    description: 'Daftar dokumen persyaratan lengkap dan personal yang harus dibawa ke kantor pelayanan.',
  };
}

export default async function ServiceHasilPage({ params }: HasilPageProps) {
  const { serviceId } = await params;
  const service = getServiceBySlug(serviceId);

  if (!service) {
    const summary = INITIAL_SERVICES.find(
      (s) => s.slug === serviceId || s.id === serviceId
    );

    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <FileTextIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {summary ? `Hasil ${summary.name} Belum Tersedia` : 'Layanan Tidak Ditemukan'}
          </h1>
          <p className="mt-2 text-slate-600">
            {summary
              ? 'Aturan persyaratan untuk layanan ini sedang dalam proses verifikasi resmi.'
              : 'Silakan kembali ke daftar layanan untuk memilih layanan lain.'}
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Link */}
        <div className="mb-6 no-print">
          <Link
            href={`/layanan/${service.slug}/questions`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors min-h-[44px]"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Kembali ke Pertanyaan Kondisi</span>
          </Link>
        </div>

        {/* Hasil & Checklist Container */}
        <HasilContainer service={service} />
      </main>

      <Footer />
    </div>
  );
}
