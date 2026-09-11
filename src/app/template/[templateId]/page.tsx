import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getTemplateBySlug } from '@/data/templates';
import { TemplateForm } from '@/components/template/template-form';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, FileTextIcon } from '@/components/ui/icons';

interface TemplateDetailPageProps {
  params: Promise<{ templateId: string }>;
}

export async function generateMetadata({ params }: TemplateDetailPageProps) {
  const { templateId } = await params;
  const template = getTemplateBySlug(templateId);

  return {
    title: template
      ? `Buat ${template.title} — CekLayanan`
      : 'Template Tidak Ditemukan — CekLayanan',
    description: template ? template.description : 'Generator template surat resmi.',
  };
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { templateId } = await params;
  const template = getTemplateBySlug(templateId);

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <FileTextIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Template Tidak Ditemukan</h1>
          <p className="mt-2 text-slate-600">
            Format surat yang Anda cari tidak tersedia. Silakan kembali ke daftar template.
          </p>
          <div className="mt-6">
            <Link href="/template">
              <Button variant="primary">Kembali ke Daftar Template</Button>
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

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Link */}
        <div className="mb-6 no-print">
          <Link
            href="/template"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors min-h-[44px]"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Kembali ke Semua Template Surat</span>
          </Link>
        </div>

        {/* Header Info */}
        <div className="mb-8 no-print">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {template.officialCode && (
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                {template.officialCode}
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">
              Ditujukan untuk: {template.destinationAgency}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {template.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Generator Form + Live Preview */}
        <TemplateForm template={template} />
      </main>

      <Footer />
    </div>
  );
}
