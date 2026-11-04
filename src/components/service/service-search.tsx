'use client';

import React, { useState } from 'react';
import { INITIAL_SERVICES } from '@/data/services';
import { ServiceCard } from './service-card';
import { ActiveChecklistsBanner } from './active-checklists-banner';
import { SearchIcon } from '@/components/ui/icons';

export const ServiceSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Layanan (8)' },
    { id: 'kependudukan', label: 'Kependudukan (KTP/KK/Pindah)' },
    { id: 'pencatatan_sipil', label: 'Pencatatan Sipil (Akta)' },
    { id: 'keterangan_kelurahan', label: 'Kelurahan (SKU/SKTM/Waris)' },
  ];

  const quickKeywords = [
    { label: 'KTP Hilang', query: 'ktp hilang' },
    { label: 'Pecah KK Menikah', query: 'pecah kk' },
    { label: 'Bayi Baru Lahir', query: 'akta lahir bayi' },
    { label: 'Beasiswa / KIP Kuliah', query: 'kip kuliah' },
    { label: 'Pinjaman KUR UMKM', query: 'kur bank' },
    { label: 'Urus Warisan', query: 'warisan' },
  ];

  const trimmedQuery = query.toLowerCase().trim();
  const filteredServices = INITIAL_SERVICES.filter((service) => {
    const matchesCategory =
      selectedCategory === 'all' || service.category === selectedCategory;

    if (!trimmedQuery) return matchesCategory;

    const keywordsList = service.keywords ?? [];
    const keywordMatch = keywordsList.some((kw) =>
      kw.toLowerCase().includes(trimmedQuery)
    );

    const matchesQuery =
      service.name.toLowerCase().includes(trimmedQuery) ||
      service.shortDescription.toLowerCase().includes(trimmedQuery) ||
      service.destinationAgency.toLowerCase().includes(trimmedQuery) ||
      keywordMatch;

    return matchesCategory && matchesQuery;
  });

  return (
    <div id="layanan" className="scroll-mt-20">
      {/* Active Checklists Resume Banner (Muncul otomatis jika pengguna punya progress tersimpan) */}
      <ActiveChecklistsBanner />

      {/* Search Bar & Filter Controls */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari layanan atau masalah Anda (misal: KTP hilang, pecah KK, KIP Kuliah, KUR Bank)..."
            className="w-full pl-12 pr-16 py-3.5 sm:py-4 rounded-xl border border-slate-300 bg-white text-base text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none"
            aria-label="Cari layanan administrasi"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-700 px-2.5 py-1 rounded-md bg-slate-100 cursor-pointer"
              aria-label="Hapus pencarian"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Quick Problem Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="text-xs font-medium text-slate-500 mr-1">Sering dicari:</span>
          {quickKeywords.map((item) => {
            const isActive = query.toLowerCase() === item.query.toLowerCase();
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setQuery(isActive ? '' : item.query);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs sm:text-sm font-medium px-3.5 py-2 rounded-full whitespace-nowrap transition-colors cursor-pointer min-h-[38px] ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 bg-white/60">
          <p className="text-base font-semibold text-slate-800">
            Layanan &ldquo;{query}&rdquo; tidak ditemukan
          </p>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Pastikan ejaan kata kunci tepat, atau coba pilih kategori di atas untuk melihat
            daftar layanan yang tersedia.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Tampilkan semua layanan
          </button>
        </div>
      )}
    </div>
  );
};
