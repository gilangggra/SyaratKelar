import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getServiceBySlug, INITIAL_SERVICES } from '@/data/services';
import { QuestionWizard } from '@/components/questions/question-wizard';
import { Button } from '@/components/ui/button';
import { FileTextIcon } from '@/components/ui/icons';

interface QuestionsPageProps {
  params: Promise<{ serviceId: string }>;
}

export async function generateMetadata({ params }: QuestionsPageProps) {
  const { serviceId } = await params;
  const service = getServiceBySlug(serviceId);

  return {
    title: service
      ? `Pertanyaan Kondisi: ${service.name} — CekLayanan`
      : 'Pertanyaan Layanan — CekLayanan',
    description: 'Jawab pertanyaan kondisi singkat untuk mendapatkan daftar persyaratan dokumen yang tepat.',
  };
}

export default async function ServiceQuestionsPage({ params }: QuestionsPageProps) {
  const { serviceId } = await params;
  const service = getServiceBySlug(serviceId);

  if (!service) {
    const summary = INITIAL_SERVICES.find((s) => s.slug === serviceId || s.id === serviceId);

    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <FileTextIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {summary ? `Pertanyaan ${summary.name} Sedang Disiapkan` : 'Layanan Tidak Ditemukan'}
          </h1>
          <p className="mt-2 text-slate-600">
            {summary
              ? 'Konfigurasi aturan pertanyaan untuk layanan ini sedang dalam proses verifikasi resmi.'
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
        <QuestionWizard service={service} />
      </main>

      <Footer />
    </div>
  );
}
