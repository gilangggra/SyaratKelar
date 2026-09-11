import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import {
  ShieldCheckIcon,
  ChevronLeftIcon,
  CheckIcon,
  InfoIcon,
} from '@/components/ui/icons';

export const metadata = {
  title: 'Tentang CekLayanan & Transparansi Regulasi Publik — CekLayanan',
  description:
    'Komitmen keterbukaan informasi publik, dasar hukum bebas biaya adminduk UU 24/2013, dan prinsip privasi data mandiri.',
};

export default function TentangPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
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

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
            <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
            <span>Keterbukaan Informasi Publik & Regulasi Resmi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Tentang CekLayanan
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Inisiatif independen untuk membantu masyarakat Indonesia mempersiapkan dokumen
            administrasi publik secara tepat, jelas, dan percaya diri sebelum datang ke loket
            pelayanan.
          </p>
        </div>

        {/* Section: Mengapa CekLayanan Dibuat? */}
        <div className="space-y-8">
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Prinsip Kami: &ldquo;Useful first. Impressive second.&rdquo;
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
              Banyak warga harus kehilangan waktu kerja dan bolak-balik kantor dinas hanya karena
              dokumen yang dibawa kurang atau tidak sesuai dengan kondisi spesifik mereka. Informasi
              administrasi sering kali tersebar, menggunakan bahasa birokrasi yang rumit, atau tidak
              diperbarui.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              CekLayanan hadir untuk menyelesaikan masalah nyata tersebut dengan menyajikan daftar
              persyaratan dokumen yang <strong>terverifikasi, terstruktur, dan disesuaikan secara personal</strong> dengan
              kondisi Anda melalui alur tanya-jawab singkat.
            </p>
          </Card>

          {/* Section: Transparansi Regulasi */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Dasar Hukum Bebas Biaya (Rp0)
                </h3>
                <p className="text-xs text-emerald-800 font-medium">
                  Hak Warga Negara Berdasarkan Undang-Undang
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <div className="p-4 rounded-xl bg-white border border-emerald-200">
                <strong className="text-slate-900 block mb-1">
                  1. UU No. 24 Tahun 2013 Pasal 79A
                </strong>
                <p className="text-xs sm:text-sm text-slate-600">
                  &ldquo;Pengurusan dan penerbitan dokumen kependudukan (KTP-el, Kartu Keluarga, Akta
                  Kelahiran, Akta Kematian, Surat Keterangan Pindah) TIDAK DIPUNGUT BIAYA (GRATIS).&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-200">
                <strong className="text-slate-900 block mb-1">
                  2. Perpres No. 96 Tahun 2018 & Permendagri No. 108 Tahun 2019
                </strong>
                <p className="text-xs sm:text-sm text-slate-600">
                  Penyederhanaan syarat administrasi kependudukan nasional, termasuk penegasan
                  penghapusan syarat surat pengantar RT/RW untuk pengurusan Surat Pindah Domisili
                  (SKPWNI) dan penggantian KTP rusak/hilang.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-200">
                <strong className="text-slate-900 block mb-1">
                  3. Penghapusan Sanksi Denda Keterlambatan
                </strong>
                <p className="text-xs sm:text-sm text-slate-600">
                  Denda administratif atas keterlambatan pencatatan kelahiran dan kematian telah
                  dihapuskan di tingkat nasional sejak berlakunya UU No. 24 Tahun 2013.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Privasi & Keamanan Data */}
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Komitmen Keamanan & Privasi Data Anda
            </h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tanpa Registrasi / Akun:</strong> Anda tidak perlu mendaftarkan email,
                  nomor telepon, atau kata sandi untuk menggunakan seluruh fitur CekLayanan.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tanpa Upload Dokumen Pribadi:</strong> CekLayanan tidak pernah meminta Anda
                  mengunggah foto KTP, Kartu Keluarga, atau dokumen identitas rahasia.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Pemrosesan Murni Client-Side:</strong> Jawaban kondisi Anda dan pembuatan
                  surat mandiri diproses langsung secara lokal di browser perangkat Anda.
                </span>
              </li>
            </ul>
          </Card>

          {/* Section: Disclaimer Resmi */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 flex items-start gap-3.5 shadow-2xs">
            <InfoIcon className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Pernyataan Batasan Tanggung Jawab:</strong>
              CekLayanan merupakan alat bantu persiapan administrasi publik independen. Meskipun
              seluruh informasi dirujuk langsung dari peraturan perundang-undangan resmi, kebijakan
              teknis operasional loket dapat bervariasi pada masing-masing pemerintah daerah. Keputusan
              akhir penerimaan berkas tetap berada pada kewenangan petugas instansi terkait.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
