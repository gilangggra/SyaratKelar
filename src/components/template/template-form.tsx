'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DocumentTemplate } from '@/types';
import { TemplatePreview } from './template-preview';
import { validateTemplateForm, ValidationErrors } from '@/lib/validation/templateValidation';
import { useLocalStorage } from '@/lib/storage/useStorage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { PrinterIcon, ShieldCheckIcon, RotateCcwIcon, ArrowRightIcon } from '@/components/ui/icons';

export interface TemplateFormProps {
  template: DocumentTemplate;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({ template }) => {
  const [values, setValues] = useLocalStorage<Record<string, string>>(
    `ceklayanan_template_draft_${template.id}`,
    {}
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const safeValues = React.useMemo(
    () => (values && typeof values === 'object' ? values : {}),
    [values]
  );

  const handleChange = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...(prev || {}), [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  const handlePrint = () => {
    const validation = validateTemplateForm(template.fields, safeValues);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setActiveTab('form');
      alert('Mohon lengkapi kolom isian yang bertanda merah sebelum mencetak surat.');
      return;
    }

    window.print();
  };

  const handleReset = () => {
    if (window.confirm('Hapus seluruh isian formulir dari browser Anda?')) {
      setValues({});
      setErrors({});
    }
  };

  const filledCount = template.fields.filter(
    (f) => Boolean(safeValues[f.id]?.trim())
  ).length;

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Banner */}
      <Alert
        type="info"
        title="Jaminan Privasi Klien (100% Client-Side)"
        icon={<ShieldCheckIcon className="w-5 h-5 text-blue-600" />}
        className="no-print"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
          <p>
            Data identitas yang Anda ketikkan pada formulir ini diproses{' '}
            <strong>100% di peramban perangkat Anda</strong>. Tidak ada data pribadi (nama, NIK,
            alamat) yang dikirimkan ke server mana pun.
          </p>
          {template.relatedServiceSlug && (
            <Link
              href={`/layanan/${template.relatedServiceSlug}/hasil`}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 shrink-0 underline underline-offset-2"
            >
              <span>Kembali ke Checklist</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </Alert>

      {/* Mobile Tab Switcher (Formulir vs Pratinjau) */}
      <div className="flex sm:hidden border-b border-slate-200 no-print">
        <button
          type="button"
          onClick={() => setActiveTab('form')}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 cursor-pointer ${
            activeTab === 'form'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          1. Isi Data ({filledCount}/{template.fields.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 cursor-pointer ${
            activeTab === 'preview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          2. Pratinjau Surat A4
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div
          className={`lg:col-span-6 space-y-6 ${
            activeTab === 'form' ? 'block' : 'hidden sm:block'
          } no-print`}
        >
          <Card className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900">Pengisian Data Surat</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {filledCount} / {template.fields.length} Terisi
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Isi data dengan teliti sesuai dokumen resmi KTP dan Kartu Keluarga Anda.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {template.fields.map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.id} required={field.required} subLabel={field.helperText}>
                    {field.label}
                  </Label>

                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.id}
                      rows={3}
                      value={safeValues[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full rounded-lg border bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                        errors[field.id]
                          ? 'border-rose-400 focus:ring-rose-500/20'
                          : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
                      }`}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      value={safeValues[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      error={errors[field.id]}
                    />
                  )}

                  {field.type === 'textarea' && errors[field.id] && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              ))}

              {/* Additional Metadata: Kota & Tanggal Pembuatan Surat */}
              <div className="pt-4 mt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="kota_pembuatan_surat"
                    subLabel="Ditampilkan di atas tanda tangan"
                  >
                    Kota / Kabupaten Tempat Surat Dibuat
                  </Label>
                  <Input
                    id="kota_pembuatan_surat"
                    type="text"
                    value={safeValues.kota_pembuatan_surat || ''}
                    onChange={(e) => handleChange('kota_pembuatan_surat', e.target.value)}
                    placeholder="Contoh: Jakarta Selatan / Bandung"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="tanggal_pembuatan_surat"
                    subLabel="Kosongkan untuk tanggal hari ini"
                  >
                    Tanggal Pembuatan Surat
                  </Label>
                  <Input
                    id="tanggal_pembuatan_surat"
                    type="date"
                    value={safeValues.tanggal_pembuatan_surat || ''}
                    onChange={(e) => handleChange('tanggal_pembuatan_surat', e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  leftIcon={<RotateCcwIcon className="w-4 h-4" />}
                >
                  Hapus Isian
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handlePrint}
                  leftIcon={<PrinterIcon className="w-4 h-4" />}
                >
                  Cetak / Unduh PDF
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Live Preview Column */}
        <div
          className={`lg:col-span-6 ${
            activeTab === 'preview' ? 'block' : 'hidden sm:block'
          }`}
        >
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between no-print mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pratinjau Lembar Surat Resmi (A4)
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrint}
                leftIcon={<PrinterIcon className="w-4 h-4" />}
              >
                Cetak Surat
              </Button>
            </div>

            <TemplatePreview template={template} values={safeValues} />
          </div>
        </div>
      </div>
    </div>
  );
};
