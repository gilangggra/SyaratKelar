import { Service } from '@/types';

export const skuService: Service = {
  id: 'sku',
  slug: 'sku',
  name: 'Surat Keterangan Usaha (SKU)',
  shortDescription:
    'Surat keterangan resmi dari kantor kelurahan atau desa yang menerangkan bahwa pemohon benar-benar memiliki kegiatan usaha aktif.',
  fullDescription:
    'Surat Keterangan Usaha (SKU) diterbitkan oleh Lurah atau Kepala Desa sebagai bukti keterangan administratif bahwa warga bersangkutan menjalankan usaha mikro/kecil. Dokumen ini umumnya digunakan sebagai syarat pengajuan Kredit Usaha Rakyat (KUR), pinjaman perbankan, atau pendaftaran program bantuan UMKM.',
  category: 'keterangan_kelurahan',
  categoryLabel: 'Pelayanan Kelurahan',
  destinationAgency: 'Kantor Kelurahan / Kantor Desa Setempat',
  estimatedTime: '1 hari kerja (umumnya langsung selesai di hari yang sama selama Lurah/Sekkel berada di tempat)',
  fees: {
    isFree: true,
    officialAmount: 0,
    currency: 'IDR',
    description: 'Penerbitan Surat Keterangan Usaha di Kelurahan/Desa adalah GRATIS (Rp0).',
    legalReference: 'UU No. 6 Tahun 2014 & Peraturan Pelayanan Administrasi Kelurahan',
  },
  sources: [
    {
      id: 'uu-6-2014',
      title: 'Undang-Undang Republik Indonesia Nomor 6 Tahun 2014 tentang Desa',
      sourceName: 'JDIH Kementerian Desa PDTT',
      sourceUrl: 'https://peraturan.go.id',
      verifiedAt: '2026-01-15',
      legalBasis: 'Kewenangan administrasi pelayanan umum desa dan kelurahan',
    },
    {
      id: 'sop-kelurahan',
      title: 'Standar Operasional Prosedur Pelayanan Surat Keterangan Kelurahan',
      sourceName: 'Kemendagri / Pemerintah Daerah',
      verifiedAt: '2026-01-15',
      legalBasis: 'Pelayanan tanpa retribusi daerah',
    },
  ],
  questions: [
    {
      id: 'lokasi_tempat_usaha',
      title: 'Di mana lokasi tempat usaha Anda dijalankan?',
      description: 'Menentukan apakah diperlukan surat keterangan sewa atau domisili usaha tambahan.',
      options: [
        {
          id: 'di_rumah_pribadi',
          label: 'Di Rumah Pribadi (Sesuai Alamat KTP/KK Pemohon)',
          value: 'di_rumah_pribadi',
        },
        {
          id: 'sewa_kontrak',
          label: 'Menyewa Tempat / Lokasi di Luar Rumah Sendiri',
          value: 'sewa_kontrak',
        },
      ],
      defaultValue: 'di_rumah_pribadi',
    },
  ],
  baseRequirementIds: [
    'ktp_pemohon_sku',
    'kk_pemohon_sku',
    'pengantar_rt_rw_sku',
    'pernyataan_usaha_sku',
    'foto_usaha',
  ],
  allRequirements: [
    {
      id: 'ktp_pemohon_sku',
      title: 'Fotokopi KTP-el Pemilik Usaha',
      description: 'Menunjukkan KTP asli dan menyerahkan 1 lembar salinan fotokopi.',
      isMandatory: true,
    },
    {
      id: 'kk_pemohon_sku',
      title: 'Fotokopi Kartu Keluarga (KK)',
      description: 'Salinan Kartu Keluarga pemohon yang masih berlaku.',
      isMandatory: true,
    },
    {
      id: 'pengantar_rt_rw_sku',
      title: 'Surat Pengantar dari RT dan RW Setempat',
      description: 'Surat pengantar bertandatangan dan cap basah Ketua RT serta Ketua RW lokasi usaha.',
      isMandatory: true,
      notes: 'Surat keterangan kelurahan non-adminduk pusat tetap membutuhkan pengantar RT/RW sebagai verifikasi lingkungan.',
    },
    {
      id: 'pernyataan_usaha_sku',
      title: 'Surat Pernyataan Tempat dan Kegiatan Usaha Bermaterai Rp10.000',
      description: 'Surat pernyataan mandiri mengenai kebenaran kepemilikan dan lokasi usaha aktif yang dijalankan.',
      isMandatory: true,
      notes: 'Dibuat mandiri dengan materai Rp10.000 sebelum meminta pengantar RT/RW atau diajukan ke kelurahan.',
      templateAvailable: true,
      templateId: 'surat-pernyataan-usaha',
    },
    {
      id: 'foto_usaha',
      title: 'Foto Fisik Kegiatan Usaha / Tempat Usaha',
      description: 'Cetak foto berwarna yang memperlihatkan plang usaha, etalase barang, atau tempat berniaga pemohon.',
      isMandatory: true,
      notes: 'Umumnya diminta 1 lembar foto ukuran 3R/4R atau diprint di kertas HVS.',
    },
    {
      id: 'perjanjian_sewa_lokasi',
      title: 'Surat Perjanjian Sewa / Izin Tempat Usaha',
      description: 'Fotokopi surat sewa tempat atau surat tidak keberatan dari pemilik bangunan.',
      isMandatory: false,
      notes: 'Hanya jika lokasi usaha mengontrak/menyewa dari pihak lain.',
    },
  ],
  rules: [
    {
      id: 'rule_sewa_lokasi',
      questionId: 'lokasi_tempat_usaha',
      operator: 'equals',
      value: 'sewa_kontrak',
      requirementIds: ['perjanjian_sewa_lokasi'],
    },
  ],
};
