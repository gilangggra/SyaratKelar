'use client';

import React, { useState } from 'react';
import { CustomItem } from '@/utils/share-formatter';
import { Button } from '@/components/ui/button';
import { PlusIcon, Trash2Icon, InfoIcon } from '@/components/ui/icons';

export interface CustomItemsSectionProps {
  items: CustomItem[];
  onAddItem: (text: string) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export const CustomItemsSection: React.FC<CustomItemsSectionProps> = ({
  items,
  onAddItem,
  onToggleItem,
  onDeleteItem,
}) => {
  const [inputText, setInputText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onAddItem(trimmed);
    setInputText('');
    setIsAdding(false);
  };

  const quickSuggestions = [
    'Materai Rp10.000 (2 lembar)',
    'Pasfoto 3x4 latar belakang merah (2 lembar)',
    'Map kertas snelhechter warna biru',
    'Pulpen tinta hitam',
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Perlengkapan Tambahan Pribadi
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {items.length} Item
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Catat kebutuhan fisik tambahan Anda (seperti materai, map, atau pasfoto).
          </p>
        </div>

        {!isAdding && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            leftIcon={<PlusIcon className="w-4 h-4" />}
            className="no-print shrink-0"
          >
            Tambah Perlengkapan
          </Button>
        )}
      </div>

      {/* Form Input Tambah */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4 pt-3 border-t border-slate-100 no-print">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Contoh: Materai 10.000 2 lembar, Map snelhechter..."
              className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            <div className="flex items-center gap-2 shrink-0">
              <Button type="submit" variant="primary" size="sm" disabled={!inputText.trim()}>
                Simpan
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setInputText('');
                  setIsAdding(false);
                }}
              >
                Batal
              </Button>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <InfoIcon className="w-3 h-3" /> Saran cepat:
            </span>
            {quickSuggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onAddItem(sug);
                  setIsAdding(false);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 transition-colors"
              >
                + {sug}
              </button>
            ))}
          </div>
        </form>
      )}

      {/* List Items */}
      {items.length === 0 ? (
        <div className="py-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 no-print">
          <p className="text-xs sm:text-sm text-slate-500">
            Belum ada perlengkapan tambahan yang dicatat.
          </p>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
          >
            + Klik di sini untuk mencatat materai, pasfoto, atau map
          </button>
        </div>
      ) : (
        <div className="space-y-2 mt-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                item.isChecked
                  ? 'bg-slate-50/80 border-slate-200 text-slate-500'
                  : 'bg-white border-slate-200 text-slate-800 shadow-2xs hover:border-slate-300'
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={() => onToggleItem(item.id)}
                  className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                />
                <span
                  className={`text-sm truncate select-none ${
                    item.isChecked ? 'line-through text-slate-400' : 'font-medium text-slate-800'
                  }`}
                >
                  {item.text}
                </span>
              </label>

              <button
                type="button"
                onClick={() => onDeleteItem(item.id)}
                title="Hapus perlengkapan ini"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors no-print"
                aria-label={`Hapus ${item.text}`}
              >
                <Trash2Icon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
