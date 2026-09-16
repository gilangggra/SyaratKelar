import React from 'react';
import { Service } from '@/types';
import { InfoIcon, ShieldCheckIcon } from '@/components/ui/icons';

export interface ServiceProcedureTimelineProps {
  service: Service;
}

export const ServiceProcedureTimeline: React.FC<ServiceProcedureTimelineProps> = ({ service }) => {
  const steps = [
    {
      number: 1,
      title: 'Persiapan Map Berkas di Rumah',
      desc: 'Masukkan dokumen asli dan salinan fotokopi (minimal 2 rangkap) ke dalam satu map fisik. Pastikan membawa pulpen tinta hitam dan materai jika diperlukan.',
      badge: 'Sebelum Berangkat',
    },
    {
      number: 2,
      title: `Tiba di ${service.destinationAgency}`,
      desc: 'Datang di pagi hari pada jam operasional loket (umumnya 08.00 - 14.00). Ambil nomor antrean pendaftaran di meja informasi atau mesin antrean mandiri.',
      badge: 'Di Kantor Dinas',
    },
    {
      number: 3,
      title: 'Pemeriksaan & Verifikasi Berkas di Loket',
      desc: 'Saat nomor dipanggil, serahkan map berkas kepada petugas loket. Petugas akan mencocokkan dokumen asli dengan fotokopi dan memvalidasi formulir permohonan.',
      badge: 'Di Meja Loket',
    },
    {
      number: 4,
      title: 'Penerbitan Dokumen atau Tanda Terima',
      desc: `Layanan kependudukan tidak dipungut biaya (Gratis Rp0). Jika dokumen belum langsung dicetak, Anda akan menerima lembar resi bukti pengambilan dengan estimasi: ${service.estimatedTime || '1 - 3 hari kerja'}.`,
      badge: 'Selesai',
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Panduan Loket
          </span>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Alur & Tahapan Pengurusan di Kantor Pelayanan
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Estimasi alur fisik langkah demi langkah saat Anda datang ke {service.destinationAgency}.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit shrink-0">
          <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
          <span>Biaya Resmi: Gratis Rp0</span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-100 space-y-6 sm:space-y-8 my-2 ml-3">
        {steps.map((step) => (
          <div key={step.number} className="relative group">
            {/* Step Number Dot */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center ring-4 ring-white shadow-xs">
              {step.number}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {step.title}
                </h4>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {step.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Useful Callout */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
        <InfoIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Tips Antrean:</strong> Sebagian kantor Disdukcapil atau Kelurahan di kota-kota besar menyediakan pendaftaran nomor antrean daring melalui aplikasi pemda setempat. Periksa situs resmi instansi terkait bila ingin menghindari antrean fisik.
        </span>
      </div>
    </div>
  );
};
