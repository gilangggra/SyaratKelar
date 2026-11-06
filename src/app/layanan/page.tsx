import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ServiceSearch } from '@/components/service/service-search';
import { ChevronLeftIcon } from '@/components/ui/icons';

export const metadata = {
  title: 'Daftar Layanan Administrasi Publik — CekLayanan',
  description:
    'Pilih layanan administrasi publik yang ingin Anda persiapkan (KTP, KK, Pindah Domisili, Akta, dll.) untuk melihat persyaratan lengkapnya.',
};

export default function LayananIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
        </div>

        <div className="mb-8 text-center max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pilih Layanan Administrasi
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Pilih dokumen yang hendak Anda urus untuk melihat daftar persyaratan sesuai kondisi Anda.
          </p>
        </div>

        <ServiceSearch />
      </main>

      <Footer />
    </div>
  );
}
