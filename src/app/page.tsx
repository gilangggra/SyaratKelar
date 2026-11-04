import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ServiceSearch } from '@/components/service/service-search';
import { LifeEventsSection } from '@/components/service/life-events-section';
import {
  ShieldCheckIcon,
  CheckIcon,
  InfoIcon,
  ArrowRightIcon,
  FileTextIcon,
} from '@/components/ui/icons';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold mb-4">
              <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
              <span>Panduan Administrasi Publik Mandiri</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
              Sudah lengkap sebelum berangkat?
            </h1>

            {/* Sub-headline */}
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Ketahui persyaratan dokumen resmi yang disesuaikan dengan kondisi spesifik Anda.
              Hindari bolak-balik kantor pelayanan dan siapkan map berkas sekali jalan.
            </p>

            {/* Micro Highlights */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                Disaring cerdas sesuai kondisi Anda
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                Biaya resmi transparan (Gratis Rp0)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                Privat 100% di perangkat, tanpa login
              </span>
            </div>
          </div>

          {/* 3. Interactive Service Search, Active Checklists, & Grid */}
          <ServiceSearch />
        </section>

        {/* 4. Panduan Paket Peristiwa Kehidupan (Multi-Service Bundles) */}
        <div className="border-t border-slate-200 bg-slate-100/60">
          <LifeEventsSection />
        </div>

        {/* 5. Cara Kerja Section */}
        <section
          id="cara-kerja"
          className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-y border-slate-200"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 mb-2">
                Alur Praktis
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Cara Kerja CekLayanan
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Tiga langkah sederhana untuk memastikan seluruh berkas lengkap sebelum datang ke
                kantor dinas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Step 1 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-xs">
                  1
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Pilih Layanan / Peristiwa</h4>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">
                  Temukan jenis layanan yang ingin Anda urus (seperti KTP, Kartu Keluarga, Pindah
                  Domisili, Akta, atau Surat Keterangan Kelurahan).
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-xs">
                  2
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Jawab Pertanyaan Kondisi</h4>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">
                  Jawab 2&ndash;3 pertanyaan singkat. Mesin aturan akan menyaring persyaratan dokumen
                  dan menghitung kebutuhan materai sesuai situasi Anda.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-xs">
                  3
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  Checklist, Buat Surat &amp; Berangkat
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">
                  Centang dokumen yang sudah siap, cetak template surat pernyataan mandiri (SPTJM/SKTM)
                  bila diperlukan, dan datang ke loket sekali jalan.
                </p>
              </div>
            </div>

            {/* Template Generator Callout Banner */}
            <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50/60 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <FileTextIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    Butuh Template Surat Pernyataan Mandiri (SPTJM F-2.03 / F-2.04 / SKTM / SKU)?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Isi formulir secara aman di browser Anda dan langsung cetak surat pernyataan resmi ukuran A4 siap tanda tangan di atas materai.
                  </p>
                </div>
              </div>
              <Link
                href="/template"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shrink-0 transition-colors shadow-2xs"
              >
                <span>Buka Generator Surat</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Transparansi & Nilai Keterbukaan */}
        <section id="transparansi" className="py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-600">
                Keterbukaan Publik
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                Hak Warga: Bebas Biaya &amp; Bebas Calo
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Berdasarkan <strong>Undang-Undang No. 24 Tahun 2013</strong> Pasal 79A, pengurusan
                dan penerbitan dokumen administrasi kependudukan (KTP, KK, Akta Kelahiran, Akta
                Kematian, Surat Pindah) adalah <strong>GRATIS (Rp0)</strong>.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Jangan pernah membayar biaya tidak resmi kepada pihak manapun. CekLayanan selalu
                menyajikan dasar hukum dan informasi biaya resmi yang dapat diverifikasi.
              </p>

              <div className="pt-2">
                <Link
                  href="/#layanan"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 min-h-[44px]"
                >
                  <span>Mulai cek persyaratan sekarang</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheckIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Prinsip Privasi Data</h3>
                    <p className="text-xs text-emerald-800 font-medium">Aman &amp; Mandiri</p>
                  </div>
                </div>

                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Tanpa Registrasi:</strong> Tidak perlu membuat akun ataupun login untuk
                      mengakses seluruh panduan.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Tanpa Upload Dokumen:</strong> Kami tidak meminta Anda mengunggah foto
                      KTP, KK, ataupun dokumen rahasia lainnya.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Penyimpanan Lokal:</strong> Status checklist Anda tersimpan murni di
                      browser perangkat Anda sendiri.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Official Disclaimer Box */}
        <section className="px-4 sm:px-6 pb-16 max-w-6xl mx-auto">
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 flex items-start gap-3.5 shadow-2xs">
            <InfoIcon className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Catatan Penting:</strong> Informasi pada
              CekLayanan disusun untuk membantu persiapan awal dokumen Anda. Persyaratan dapat
              mengalami penyesuaian oleh instansi daerah sesuai kebijakan lokal. Keputusan akhir
              penerimaan berkas tetap berada pada petugas loket instansi pelayanan terkait.
            </div>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
