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
  keywords: [
    'kur bank',
    'pinjaman modal usaha',
    'umkm',
    'surat keterangan usaha',
    'nib',
    'usaha warung',
    'kredit bri mandiri bni',
  ],
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
      description: 'Menentukan apakah diperlukan surat keterangan sewa atau bukti izin lokasi usaha tambahan.',
      options: [
        {
          id: 'di_rumah_pribadi',
          label: 'Di Rumah Pribadi (Sesuai Alamat KTP/KK Pemohon)',
          value: 'di_rumah_pribadi',
        },
        {
          id: 'sewa_kontrak',
          label: 'Menyewa Tempat / Ruko / Lapak di Luar Rumah Sendiri',
          value: 'sewa_kontrak',
        },
      ],
      defaultValue: 'di_rumah_pribadi',
    },
    {
      id: 'status_ktp_pemohon',
      title: 'Apakah alamat KTP-el Anda sesuai dengan Kelurahan lokasi usaha?',
      description: 'Menentukan apakah diperlukan keterangan domisili usaha bagi warga luar kelurahan.',
      options: [
        {
          id: 'ktp_setempat',
          label: 'Ya, KTP Sesuai dengan Kelurahan Tempat Usaha',
          value: 'ktp_setempat',
        },
        {
          id: 'ktp_luar',
          label: 'Tidak, KTP Berasal dari Kelurahan / Kota Lain',
          value: 'ktp_luar',
        },
      ],
      defaultValue: 'ktp_setempat',
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
      title: 'Fotokopi & Asli KTP-el Pemilik Usaha',
      description: 'Menunjukkan KTP asli dan menyerahkan salinan fotokopi.',
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
      title: 'Surat Pengantar dari RT dan RW Lokasi Usaha',
      description: 'Surat pengantar bertandatangan dan cap basah Ketua RT serta Ketua RW lokasi tempat usaha.',
      isMandatory: true,
      notes: 'Surat keterangan kelurahan non-adminduk tetap membutuhkan pengantar RT/RW sebagai verifikasi lingkungan.',
    },
    {
      id: 'pernyataan_usaha_sku',
      title: 'Surat Pernyataan Tempat dan Kegiatan Usaha Bermaterai Rp10.000',
      description: 'Surat pernyataan mandiri mengenai kebenaran kepemilikan dan lokasi usaha aktif yang dijalankan.',
      isMandatory: true,
      requiresMaterai: true,
      notes: 'Dibuat mandiri dengan materai Rp10.000 sebelum meminta pengantar RT/RW atau diajukan ke kelurahan.',
      templateAvailable: true,
      templateId: 'surat-pernyataan-usaha',
    },
    {
      id: 'foto_usaha',
      title: 'Foto Fisik Kegiatan Usaha / Tempat Usaha',
      description: 'Cetak foto berwarna yang memperlihatkan pemilik usaha di depan plang usaha, etalase barang, atau tempat berniaga.',
      isMandatory: true,
      notes: 'Umumnya diminta 1-2 lembar foto ukuran 3R/4R atau dicetak di kertas HVS.',
    },
    {
      id: 'perjanjian_sewa_lokasi',
      title: 'Bukti Sewa Tempat / Kwitansi Kontrak / Surat Izin Pemilik Lahan',
      description: 'Fotokopi surat perjanjian sewa tempat, kuitansi sewa, atau surat tidak keberatan dari pemilik bangunan.',
      isMandatory: false,
      notes: 'Wajib dilampirkan karena lokasi usaha berada di bangunan/lahan sewa.',
    },
    {
      id: 'keterangan_domisili_rt_rw_usaha',
      title: 'Keterangan Domisili Tempat Usaha dari RT/RW Setempat',
      description: 'Penegasan pada surat pengantar RT/RW bahwa pemohon ber-KTP luar daerah benar membuka usaha aktif di wilayah RT/RW tersebut.',
      isMandatory: false,
      notes: 'Diperlukan karena alamat KTP pemohon berbeda dengan kelurahan lokasi usaha.',
    },
  ],
  rules: [
    {
      id: 'rule_sewa_lokasi',
      questionId: 'lokasi_tempat_usaha',
      operator: 'equals',
      value: 'sewa_kontrak',
      reasonLabel: 'Lokasi Usaha: Menyewa Tempat / Di Luar Rumah Pribadi',
      requirementIds: ['perjanjian_sewa_lokasi'],
    },
    {
      id: 'rule_sku_ktp_luar',
      questionId: 'status_ktp_pemohon',
      operator: 'equals',
      value: 'ktp_luar',
      reasonLabel: 'Domisili KTP: Berbeda dengan Kelurahan Lokasi Usaha',
      requirementIds: ['keterangan_domisili_rt_rw_usaha'],
    },
  ],
  pitfalls: [
    {
      id: 'sku-masa-berlaku-rt-rw',
      title: 'Masa Berlaku Surat Pengantar RT/RW',
      description: 'Surat pengantar dari Ketua RT dan RW setempat umumnya hanya diakui berlaku selama maksimal 30 hari sejak tanggal ditandatangani. Segera bawa berkas ke kantor Kelurahan/Desa.',
      type: 'warning',
    },
    {
      id: 'sku-foto-kegiatan-jelas',
      title: 'Foto Usaha Harus Memperlihatkan Aktivitas Riil',
      description: 'Pastikan foto fisik yang dicetak memperlihatkan plang nama usaha, produk jualan, dan diri Anda saat berada di lokasi usaha. Petugas kelurahan menolak foto yang hanya diambil dari internet.',
      type: 'caution',
    },
    {
      id: 'sku-izin-sewa',
      title: 'Sewa Tempat Wajib Surat Perjanjian',
      description: 'Jika lokasi usaha bukan di rumah sendiri (menyewa ruko/kios/lahan pihak lain), siapkan fotokopi surat perjanjian sewa atau surat persetujuan dari pemilik tempat.',
      type: 'info',
    },
  ],
  faqs: [
    {
      id: 'faq-sku-1',
      question: 'Apa perbedaan SKU dari Kelurahan dengan NIB (Nomor Induk Berusaha)?',
      answer: 'SKU adalah surat keterangan wilayah dari Kelurahan yang lazim digunakan untuk syarat pengajuan pinjaman modal KUR di bank. NIB adalah identitas legalitas usaha nasional resmi yang diterbitkan secara online melalui portal OSS (Online Single Submission) Kementerian Investasi/BKPM.',
    },
    {
      id: 'faq-sku-2',
      question: 'Apakah pembuatan SKU di Kelurahan dikenakan biaya?',
      answer: 'Gratis Rp0. Seluruh pelayanan administrasi persuratan di Kelurahan dan Kantor Desa tidak dikenakan biaya retribusi apapun.',
    },
    {
      id: 'faq-sku-3',
      question: 'Apakah usaha yang baru buka 1 bulan bisa dibuatkan SKU?',
      answer: 'Bisa, asalkan usaha tersebut memang nyata beroperasi secara fisik di lingkungan tersebut dan diketahui oleh Ketua RT dan RW setempat.',
    },
  ],
};
