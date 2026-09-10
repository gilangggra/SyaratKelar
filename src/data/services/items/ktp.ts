import { Service } from '@/types';

export const ktpService: Service = {
  id: 'ktp',
  slug: 'ktp',
  name: 'KTP Elektronik (KTP-el)',
  shortDescription:
    'Pembuatan KTP-el baru usia 17 tahun, penggantian KTP rusak, atau penerbitan ulang karena KTP hilang.',
  fullDescription:
    'Kartu Tanda Penduduk Elektronik (KTP-el) adalah identitas resmi bukti kependudukan yang diterbitkan oleh Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil) yang berlaku di seluruh wilayah NKRI.',
  category: 'kependudukan',
  categoryLabel: 'Administrasi Kependudukan',
  destinationAgency: 'Kantor Disdukcapil / Kecamatan / Kelurahan',
  estimatedTime: '1 - 3 hari kerja (tergantung ketersediaan blangko di Disdukcapil setempat)',
  fees: {
    isFree: true,
    officialAmount: 0,
    currency: 'IDR',
    description: 'Penerbitan KTP-el adalah GRATIS (Rp0). Tidak dipungut biaya retribusi apapun.',
    legalReference: 'UU No. 24 Tahun 2013 Pasal 79A',
  },
  sources: [
    {
      id: 'uu-24-2013',
      title: 'Undang-Undang Republik Indonesia Nomor 24 Tahun 2013',
      sourceName: 'JDIH Kementerian Dalam Negeri',
      sourceUrl: 'https://peraturan.go.id/id/uu-no-24-tahun-2013',
      verifiedAt: '2026-01-15',
      legalBasis: 'Pasal 79A UU No. 24/2013 (Pengurusan dan penerbitan dokumen gratis)',
    },
    {
      id: 'permendagri-108-2019',
      title: 'Permendagri No. 108 Tahun 2019 tentang Pelaksanaan Perpres No. 96 Tahun 2018',
      sourceName: 'Ditjen Dukcapil Kemendagri',
      sourceUrl: 'https://dukcapil.kemendagri.go.id',
      verifiedAt: '2026-01-15',
      legalBasis: 'Pasal 15 (Persyaratan penerbitan KTP-el baru, hilang, atau rusak)',
    },
  ],
  questions: [
    {
      id: 'alasan_pengurusan',
      title: 'Apa alasan pengurusan KTP-el Anda?',
      description: 'Pilih kondisi yang paling tepat sesuai dengan kebutuhan Anda saat ini.',
      options: [
        {
          id: 'baru',
          label: 'Pembuatan Baru (Baru berusia 17 tahun / Belum pernah punya KTP)',
          value: 'baru',
        },
        {
          id: 'rusak',
          label: 'KTP Rusak (Fisik patah, terkelupas, atau tulisan buram)',
          value: 'rusak',
        },
        {
          id: 'hilang',
          label: 'KTP Hilang (Dompet hilang, tercecer, dll.)',
          value: 'hilang',
        },
      ],
      defaultValue: 'baru',
    },
    {
      id: 'lokasi_pengurusan',
      title: 'Di mana Anda akan mengurus KTP-el?',
      description: 'Dukcapil melayani perekaman dan cetak KTP di luar domisili asal.',
      options: [
        {
          id: 'domisili_asal',
          label: 'Sesuai Domisili KTP/KK Asal',
          value: 'domisili_asal',
        },
        {
          id: 'luar_domisili',
          label: 'Di Luar Domisili (Sedang merantau / di luar kota)',
          value: 'luar_domisili',
        },
      ],
      defaultValue: 'domisili_asal',
    },
  ],
  baseRequirementIds: ['kk_asli'],
  allRequirements: [
    {
      id: 'kk_asli',
      title: 'Fotokopi / Asli Kartu Keluarga (KK)',
      description: 'Menunjukkan KK yang memuat NIK pemohon untuk verifikasi data kependudukan.',
      isMandatory: true,
      notes: 'Pastikan data pada KK sudah mutakhir dan tidak ada salah ketik nama.',
    },
    {
      id: 'surat_kehilangan_polisi',
      title: 'Surat Keterangan Kehilangan dari Kepolisian',
      description: 'Surat tanda lapor kehilangan dari Polsek atau Polres setempat yang masih berlaku.',
      isMandatory: false,
      notes: 'Wajib dibawa apabila alasan pengurusan adalah KTP hilang.',
    },
    {
      id: 'ktp_rusak_fisik',
      title: 'Fisik KTP-el Lama yang Rusak',
      description: 'Membawa KTP-el lama untuk diserahkan dan ditukar dengan blangko baru.',
      isMandatory: false,
      notes: 'Petugas loket akan menarik fisik KTP lama saat KTP baru diserahkan.',
    },
    {
      id: 'perekaman_biometrik',
      title: 'Hadir Langsung untuk Perekaman Biometrik',
      description: 'Pemohon wajib datang langsung ke loket untuk rekam sidik jari, iris mata, dan foto wajah.',
      isMandatory: false,
      notes: 'Hanya bagi pemohon pemula yang belum pernah melakukan perekaman biometrik.',
    },
    {
      id: 'surat_permohonan_luar_domisili',
      title: 'Surat Permohonan Cetak Luar Domisili',
      description: 'Formulir permohonan cetak KTP-el di luar alamat domisili asal yang disediakan di loket Disdukcapil tujuan.',
      isMandatory: false,
      notes: 'Tidak memerlukan surat pindah domisili jika hanya cetak ulang KTP.',
    },
  ],
  rules: [
    {
      id: 'rule_ktp_hilang',
      questionId: 'alasan_pengurusan',
      operator: 'equals',
      value: 'hilang',
      requirementIds: ['surat_kehilangan_polisi'],
    },
    {
      id: 'rule_ktp_rusak',
      questionId: 'alasan_pengurusan',
      operator: 'equals',
      value: 'rusak',
      requirementIds: ['ktp_rusak_fisik'],
    },
    {
      id: 'rule_ktp_baru',
      questionId: 'alasan_pengurusan',
      operator: 'equals',
      value: 'baru',
      requirementIds: ['perekaman_biometrik'],
    },
    {
      id: 'rule_ktp_luar_domisili',
      questionId: 'lokasi_pengurusan',
      operator: 'equals',
      value: 'luar_domisili',
      requirementIds: ['surat_permohonan_luar_domisili'],
    },
  ],
};
