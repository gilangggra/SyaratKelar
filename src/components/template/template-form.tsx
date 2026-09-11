'use client';

import React, { useState } from 'react';
import { DocumentTemplate } from '@/types';
import { TemplatePreview } from './template-preview';
import { validateTemplateForm, ValidationErrors } from '@/lib/validation/templateValidation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { PrinterIcon, ShieldCheckIcon, RotateCcwIcon } from '@/components/ui/icons';

export interface TemplateFormProps {
  template: DocumentTemplate;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({ template }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const handleChange = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  const handlePrint = () => {
    const validation = validateTemplateForm(template.fields, values);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setActiveTab('form');
      alert('Mohon lengkapi kolom isian yang bertanda merah sebelum mencetak surat.');
      return;
    }

    window.print();
  };

  const handleReset = () => {
    if (window.confirm('Hapus seluruh isian formulir?')) {
      setValues({});
      setErrors({});
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Banner */}
      <Alert
        type="info"
        title="Jaminan Privasi Klien (Client-Side Only)"
        icon={<ShieldCheckIcon className="w-5 h-5 text-blue-600" />}
        className="no-print"
      >
        <p className="mt-1">
          Data identitas yang Anda ketikkan pada formulir ini diproses <strong>100% di browser perangkat Anda</strong>.
          Tidak ada data pribadi (nama, NIK, alamat) yang dikirimkan atau disimpan ke server mana pun.
        </p>
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
          1. Isi Data Formulir
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
          2. Pratinjau Surat
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
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Pengisian Data Surat
            </h3>
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
                      value={values[field.id] || ''}
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
                      value={values[field.id] || ''}
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
                Pratinjau Lembar Surat (A4)
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

            <TemplatePreview template={template} values={values} />
          </div>
        </div>
      </div>
    </div>
  );
};
