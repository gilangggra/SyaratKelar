import React from 'react';
import { DocumentTemplate } from '@/types';

export interface TemplatePreviewProps {
  template: DocumentTemplate;
  values: Record<string, string>;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  values,
}) => {
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const getVal = (id: string, fallback: string = '..................................................') => {
    return values[id]?.trim() || fallback;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-12 max-w-3xl mx-auto font-serif text-slate-900 leading-relaxed print:p-0 print:border-none print:shadow-none">
      {/* Official Header */}
      <div className="text-center mb-8 border-b-2 border-slate-900 pb-4">
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
      <p className="text-sm mb-4">
        Saya yang bertanda tangan di bawah ini:
      </p>

      {/* Identity Table */}
      <div className="text-sm space-y-2 mb-6 pl-4">
        {template.fields
          .filter((f) => f.id.includes('pemohon') || f.id.includes('suami') || f.id.includes('pelapor') || f.id === 'pekerjaan' || f.id === 'alamat')
          .map((field) => (
            <div key={field.id} className="grid grid-cols-12 gap-2">
              <span className="col-span-4 font-medium text-slate-700">{field.label}</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5">
                {getVal(field.id)}
              </span>
            </div>
          ))}
      </div>

      {/* Declaration Body */}
      <p className="text-sm mb-4">
        Dengan ini menyatakan dengan sesungguhnya dan sebenarnya bahwa:
      </p>

      {/* Specific Details */}
      <div className="text-sm space-y-2 mb-6 pl-4">
        {template.fields
          .filter((f) => !f.id.includes('pemohon') && !f.id.includes('suami') && !f.id.includes('pelapor') && f.id !== 'pekerjaan' && f.id !== 'alamat' && !f.id.includes('saksi'))
          .map((field) => (
            <div key={field.id} className="grid grid-cols-12 gap-2">
              <span className="col-span-4 font-medium text-slate-700">{field.label}</span>
              <span className="col-span-1">:</span>
              <span className="col-span-7 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5">
                {getVal(field.id)}
              </span>
            </div>
          ))}
      </div>

      {/* Closing Statement */}
      <p className="text-sm text-justify leading-relaxed mb-10">
        Demikian Surat Pernyataan ini saya buat dengan sadar dan penuh rasa tanggung jawab tanpa ada
        paksaan dari pihak manapun. Apabila di kemudian hari pernyataan ini terbukti tidak benar atau
        palsu, saya bersedia dituntut sesuai dengan ketentuan peraturan perundang-undangan yang
        berlaku.
      </p>

      {/* Date & Signatures */}
      <div className="text-sm">
        <div className="text-right mb-6">
          <p>Dibuat di: .............................., {todayFormatted}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-center pt-2">
          {/* Saksi Column if exists */}
          {template.fields.some((f) => f.id.includes('saksi')) ? (
            <div className="flex flex-col justify-between h-44">
              <p className="font-medium">Mengetahui Saksi-saksi:</p>
              <div className="flex justify-around text-xs gap-4">
                <div>
                  <p className="border-b border-slate-900 pb-1 w-28 font-bold mx-auto">
                    {getVal('nama_saksi_1', '( ........................... )')}
                  </p>
                  <p className="mt-1">Saksi I</p>
                </div>
                <div>
                  <p className="border-b border-slate-900 pb-1 w-28 font-bold mx-auto">
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
            <div className="w-24 h-14 border border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-400 font-sans my-2">
              MATERAI Rp10.000
            </div>

            <div>
              <p className="border-b border-slate-900 pb-1 font-bold text-center min-w-[160px]">
                {getVal('nama_pemohon') !== '..................................................'
                  ? getVal('nama_pemohon')
                  : getVal('nama_suami') !== '..................................................'
                  ? getVal('nama_suami')
                  : getVal('nama_pelapor', '( ................................... )')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
