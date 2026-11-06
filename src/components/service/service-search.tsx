'use client';

import React, { useState } from 'react';
import { INITIAL_SERVICES } from '@/data/services';
import { ServiceCard } from './service-card';
import { SearchIcon } from '@/components/ui/icons';

export const ServiceSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'kependudukan', label: 'Kependudukan (KTP/KK/Pindah)' },
    { id: 'pencatatan_sipil', label: 'Pencatatan Sipil (Akta)' },
    { id: 'keterangan_kelurahan', label: 'Surat Kelurahan' },
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
      {/* Search Bar & Category Filter */}
      <div className="max-w-xl mx-auto mb-6">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari layanan (contoh: KTP, KK, Akta Lahir, Pindah, SKTM)..."
            className="w-full pl-11 pr-16 py-3 rounded-xl border border-slate-300 bg-white text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            aria-label="Cari layanan administrasi"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md bg-slate-100 cursor-pointer"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1 mt-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-300 bg-white">
          <p className="text-sm font-semibold text-slate-800">
            Layanan &ldquo;{query}&rdquo; tidak ditemukan
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            className="mt-2 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            Tampilkan semua layanan
          </button>
        </div>
      )}
    </div>
  );
};
