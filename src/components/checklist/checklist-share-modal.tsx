'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Share2Icon,
  CopyIcon,
  CheckIcon,
  XIcon,
  FileTextIcon,
} from '@/components/ui/icons';

export interface ChecklistShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareText: string;
  whatsappUrl: string;
  serviceName: string;
}

export const ChecklistShareModal: React.FC<ChecklistShareModalProps> = ({
  isOpen,
  onClose,
  shareText,
  whatsappUrl,
  serviceName,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([shareText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedName = serviceName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    link.download = `checklist-${sanitizedName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Share2Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 id="share-modal-title" className="text-lg font-bold text-slate-900">
                Bagikan & Simpan Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Kirim ringkasan berkas ke WhatsApp atau salin ke catatan Anda.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Tutup modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              type="button"
              variant="primary"
              fullWidth
              className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 justify-center h-11"
            >
              <span className="flex items-center gap-2">
                <span>💬 Kirim ke WhatsApp</span>
              </span>
            </Button>
          </a>

          {/* Copy Button */}
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleCopy}
            leftIcon={
              copied ? (
                <CheckIcon className="w-4 h-4 text-emerald-600" />
              ) : (
                <CopyIcon className="w-4 h-4 text-slate-600" />
              )
            }
            className={`h-11 justify-center ${
              copied
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                : 'border-slate-300 hover:bg-slate-50'
            }`}
          >
            {copied ? 'Tersalin ke Clipboard!' : 'Salin Seluruh Teks'}
          </Button>
        </div>

        {/* Text Preview Box */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5 text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-slate-400">
              Pratinjau Teks Pesan:
            </span>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <FileTextIcon className="w-3.5 h-3.5" />
              <span>Unduh .txt</span>
            </button>
          </div>
          <textarea
            readOnly
            value={shareText}
            rows={7}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-700 focus:outline-hidden resize-none leading-relaxed select-all"
          />
        </div>

        {/* Modal Footer */}
        <div className="pt-2 text-right">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};
