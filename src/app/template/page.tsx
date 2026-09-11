import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { DOCUMENT_TEMPLATES } from '@/data/templates';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileTextIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ShieldCheckIcon,
} from '@/components/ui/icons';

export const metadata = {
  title: 'Generator Surat & Template Pernyataan Resmi — CekLayanan',
  description:
    'Buat dan cetak template surat pernyataan resmi (SPTJM Kelahiran, SPTJM Suami-Istri, Surat Pernyataan Tidak Mampu) secara mandiri, gratis, dan privat dari rumah.',
};

export default function TemplateIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors min-h-[44px]"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
            <span>Format Resmi Sesuai Permendagri & Kebijakan Instansi</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Generator Template Surat Mandiri
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl leading-relaxed">
            Buat dan cetak surat pernyataan resmi yang Anda butuhkan tanpa perlu jasa pengetikan
            berbayar. Data Anda aman dan diproses langsung di browser tanpa disimpan di server.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DOCUMENT_TEMPLATES.map((tmpl) => (
            <Link
              key={tmpl.id}
              href={`/template/${tmpl.slug}`}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl"
            >
              <Card
                interactive
                className="h-full flex flex-col p-6 transition-all group-hover:border-blue-400 group-hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  {tmpl.officialCode && (
                    <Badge variant="default" size="sm">
                      {tmpl.officialCode}
                    </Badge>
                  )}
                  <span className="text-xs text-slate-500 font-medium truncate">
                    {tmpl.destinationAgency}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileTextIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {tmpl.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
                  {tmpl.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto">
                  <span className="italic truncate max-w-[240px]">
                    Dasar: {tmpl.legalBasis}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0">
                    <span>Buat Surat</span>
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
