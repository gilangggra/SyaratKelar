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

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
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

        {/* Page Title */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Daftar Layanan Administrasi
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl leading-relaxed">
            Pilih layanan yang hendak Anda urus untuk memulai pengecekan dokumen persyaratan yang
            sesuai dengan kondisi Anda.
          </p>
        </div>

        {/* Service Search & Directory */}
        <ServiceSearch />
      </main>

      <Footer />
    </div>
  );
}
