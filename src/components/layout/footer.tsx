import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Purpose */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg">CekLayanan</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Platform panduan persiapan dokumen administrasi publik. Membantu masyarakat
              menyiapkan berkas sesuai kondisi nyata sebelum datang ke loket pelayanan.
            </p>
            <p className="text-xs text-slate-500 italic mt-1">
              Prinsip: &ldquo;Sudah lengkap sebelum berangkat.&rdquo;
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/layanan/ktp" className="hover:text-blue-600 transition-colors">
                  KTP Elektronik
                </Link>
              </li>
              <li>
                <Link href="/layanan/kartu-keluarga" className="hover:text-blue-600 transition-colors">
                  Kartu Keluarga (KK)
                </Link>
              </li>
              <li>
                <Link href="/layanan/pindah-domisili" className="hover:text-blue-600 transition-colors">
                  Surat Pindah Domisili
                </Link>
              </li>
              <li>
                <Link href="/layanan/akta-kelahiran" className="hover:text-blue-600 transition-colors">
                  Akta Kelahiran & Kematian
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Disclaimer Notice */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Pernyataan Penting
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              CekLayanan adalah alat bantu mandiri bagi warga masyarakat. Keputusan penerimaan dan
              pengesahan dokumen tetap berada pada kewenangan mutlak instansi terkait (Kelurahan,
              Kecamatan, atau Dinas Kependudukan dan Pencatatan Sipil).
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} CekLayanan. Informasi Publik Terbuka & Bebas Biaya.</p>
          <p>Akurasi &bull; Kemudahan &bull; Transparansi</p>
        </div>
      </div>
    </footer>
  );
};
