import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ServiceSearch } from '@/components/service/service-search';
import { ShieldCheckIcon, InfoIcon } from '@/components/ui/icons';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero & Daftar Layanan */}
        <section className="pt-8 sm:pt-12 pb-12 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
              <span>Layanan Kependudukan Resmi Gratis (Rp0)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Sudah lengkap sebelum berangkat?
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Pilih layanan di bawah ini, jawab pertanyaan singkat sesuai kondisi Anda, dan siapkan
              dokumen yang tepat agar tidak bolak-balik ke kantor pelayanan.
            </p>
          </div>

          <ServiceSearch />
        </section>

        {/* Cara Kerja Singkat */}
        <section className="py-10 px-4 sm:px-6 bg-white border-y border-slate-200">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 text-center mb-6">
              3 Langkah Mudah Menggunakan CekLayanan
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-blue-600 uppercase">Langkah 1</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  Pilih Layanan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Pilih dokumen yang ingin Anda urus seperti KTP, KK, Akta, atau Surat Kelurahan.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-blue-600 uppercase">Langkah 2</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  Jawab Kondisi Anda
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Jawab 1&ndash;3 pertanyaan singkat agar daftar syarat disesuaikan dengan situasi Anda.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-blue-600 uppercase">Langkah 3</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  Centang &amp; Bawa ke Loket
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Centang berkas yang sudah siap di rumah, cetak bila perlu, lalu berangkat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Singkat */}
        <section className="py-8 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
            <InfoIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-800">Catatan:</strong> Berdasarkan UU No. 24 Tahun 2013
              Pasal 79A, pengurusan dokumen kependudukan adalah <strong>Gratis (Rp0)</strong>.
              Keputusan akhir penerimaan berkas tetap berada pada petugas instansi terkait.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
