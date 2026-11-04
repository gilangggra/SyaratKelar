import React from 'react';
import { DocumentTemplate, TemplateField } from '@/types';

export interface TemplatePreviewProps {
  template: DocumentTemplate;
  values: Record<string, string>;
}

function formatIndonesianDate(dateStr?: string): string {
  if (!dateStr) return '';
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  values,
}) => {
  const defaultTodayFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const letterDate = values.tanggal_pembuatan_surat
    ? formatIndonesianDate(values.tanggal_pembuatan_surat)
    : defaultTodayFormatted;

  const letterCity = values.kota_pembuatan_surat?.trim() || '..............................';

  const getVal = (
    field: TemplateField | string,
    fallback: string = '..................................................'
  ) => {
    const id = typeof field === 'string' ? field : field.id;
    const raw = values[id]?.trim();
    if (!raw) return fallback;
    if (typeof field !== 'string' && field.type === 'date') {
      return formatIndonesianDate(raw);
    }
    return raw;
  };

  // Group fields cleanly by section metadata (with fallback for legacy fields)
  const identityFields = template.fields.filter(
    (f) =>
      f.section === 'identitas' ||
      (!f.section &&
        (f.id.includes('pemohon') ||
          f.id.includes('suami') ||
          f.id.includes('pelapor') ||
          f.id === 'pekerjaan' ||
          f.id === 'alamat'))
  );

  const statementFields = template.fields.filter(
    (f) =>
      f.section === 'pernyataan' ||
      (!f.section &&
        !identityFields.some((idf) => idf.id === f.id) &&
        !f.id.includes('saksi'))
  );

  const hasWitnesses = template.fields.some(
    (f) => f.section === 'saksi' || f.id.includes('saksi')
  );

  return (
    <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-11 max-w-3xl mx-auto font-serif text-slate-900 leading-relaxed print:p-0 print:border-none print:shadow-none">
      {/* Official Header */}
      <div className="text-center mb-7 border-b-2 border-slate-900 pb-4">
        {template.officialCode && (
          <span className="text-xs font-sans font-bold uppercase tracking-widest text-slate-600 block mb-1">
            {template.officialCode}
          </span>
        )}
        <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide underline decoration-1 underline-offset-4">
          {template.title}
        </h2>
        <p className="text-xs font-sans text-slate-500 mt-1">
          Rujukan Regulasi: {template.legalBasis}
        </p>
      </div>

      {/* Opening Statement */}
      <p className="text-sm mb-3">
        Saya yang bertanda tangan di bawah ini:
      </p>

      {/* Identity Table */}
      <div className="text-sm space-y-2 mb-5 pl-3 sm:pl-4">
        {identityFields.map((field) => (
          <div key={field.id} className="grid grid-cols-12 gap-2 items-baseline">
            <span className="col-span-5 sm:col-span-4 font-medium text-slate-800">
              {field.label}
            </span>
            <span className="col-span-1 text-center">:</span>
            <span className="col-span-6 sm:col-span-7 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 whitespace-pre-line">
              {getVal(field)}
            </span>
          </div>
        ))}
      </div>

      {/* Declaration Body */}
      <p className="text-sm mb-3 text-justify">
        {template.statementIntro ||
          'Dengan ini menyatakan dengan sesungguhnya dan sebenarnya bahwa:'}
      </p>

      {/* Specific Details */}
      <div className="text-sm space-y-2 mb-6 pl-3 sm:pl-4">
        {statementFields.map((field) => (
          <div key={field.id} className="grid grid-cols-12 gap-2 items-baseline">
            <span className="col-span-5 sm:col-span-4 font-medium text-slate-800">
              {field.label}
            </span>
            <span className="col-span-1 text-center">:</span>
            <span className="col-span-6 sm:col-span-7 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 whitespace-pre-line">
              {getVal(field)}
            </span>
          </div>
        ))}
      </div>

      {/* Closing Statement */}
      <p className="text-sm text-justify leading-relaxed mb-8">
        {template.closingStatement ||
          'Demikian Surat Pernyataan ini saya buat dengan sadar dan penuh rasa tanggung jawab tanpa ada paksaan dari pihak manapun. Apabila di kemudian hari pernyataan ini terbukti tidak benar atau tidak sesuai dengan keadaan sebenarnya, saya bersedia menerima sanksi hukum sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.'}
      </p>

      {/* Date & Signatures */}
      <div className="text-sm">
        <div className="text-right mb-5">
          <p>
            {letterCity}, {letterDate}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:gap-8 text-center pt-2">
          {/* Saksi Column if exists */}
          {hasWitnesses ? (
            <div className="flex flex-col justify-between h-44">
              <p className="font-medium">Mengetahui Saksi-Saksi:</p>
              <div className="flex justify-around text-xs gap-3">
                <div>
                  <p className="border-b border-slate-900 pb-1 min-w-[105px] font-bold mx-auto">
                    {getVal('nama_saksi_1', '( ........................... )')}
                  </p>
                  <p className="mt-1">Saksi I</p>
                </div>
                <div>
                  <p className="border-b border-slate-900 pb-1 min-w-[105px] font-bold mx-auto">
                    {getVal('nama_saksi_2', '( ........................... )')}
                  </p>
                  <p className="mt-1">Saksi II</p>
                </div>
              </div>
            </div>
          ) : (
            <div />
          )}

          {/* Pembuat Pernyataan Column */}
          <div className="flex flex-col items-center justify-between h-44">
            <p className="font-medium">Yang Membuat Pernyataan,</p>

            {/* Materai Placeholder */}
            <div className="w-24 h-14 border border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-500 font-sans my-2 px-1 text-center">
              MATERAI Rp10.000
            </div>

            <div>
              <p className="border-b border-slate-900 pb-1 font-bold text-center min-w-[160px]">
                {getVal('nama_pemohon', '') ||
                  getVal('nama_suami', '') ||
                  getVal('nama_pelapor', '( ................................... )')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
