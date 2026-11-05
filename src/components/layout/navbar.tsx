import React from 'react';
import Link from 'next/link';
import { ShieldCheckIcon } from '@/components/ui/icons';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1 shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <ShieldCheckIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
              CekLayanan
            </span>
            <span className="text-[11px] text-slate-500 font-medium hidden xs:block">
              Panduan Dokumen Publik
            </span>
          </div>
        </Link>

        {/* Navigation Links (Accessible on both mobile and desktop) */}
        <nav className="flex items-center gap-0.5 sm:gap-1.5" aria-label="Navigasi Utama">
          <Link
            href="/layanan"
            className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors min-h-[40px] flex items-center"
          >
            Layanan
          </Link>
          <Link
            href="/template"
            className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors min-h-[40px] flex items-center"
          >
            Buat Surat
          </Link>
          <Link
            href="/tentang"
            className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors min-h-[40px] flex items-center"
          >
            Info Resmi
          </Link>
        </nav>
      </div>
    </header>
  );
};
