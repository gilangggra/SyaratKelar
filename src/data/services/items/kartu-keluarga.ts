import { Service } from '@/types';

export const kartuKeluargaService: Service = {
  id: 'kartu-keluarga',
  slug: 'kartu-keluarga',
  name: 'Kartu Keluarga (KK)',
  shortDescription:
    'Pembuatan Kartu Keluarga baru setelah menikah, penambahan/pengurangan anggota keluarga, atau penggantian KK hilang/rusak.',
  fullDescription:
    'Kartu Keluarga adalah kartu identitas keluarga yang memuat data susunan, hubungan, dan jumlah anggota keluarga. Penerbitan KK dilakukan oleh Dinas Dukcapil dan ditandatangani secara elektronik (barcode TTE).',
  category: 'kependudukan',
  categoryLabel: 'Administrasi Kependudukan',
  destinationAgency: 'Kantor Disdukcapil / Kecamatan',
  estimatedTime: '1 - 2 hari kerja (dapat dicetak mandiri menggunakan kertas HVS putih A4 80 gram)',
  fees: {
    isFree: true,
    officialAmount: 0,
    currency: 'IDR',
    description: 'Penerbitan Kartu Keluarga adalah GRATIS (Rp0). Tidak ada biaya apapun.',
    legalReference: 'UU No. 24 Tahun 2013 Pasal 79A',
  },
  sources: [
    {
      id: 'uu-24-2013',
      title: 'Undang-Undang Republik Indonesia Nomor 24 Tahun 2013',
      sourceName: 'JDIH Kemendagri',
      sourceUrl: 'https://peraturan.go.id/id/uu-no-24-tahun-2013',
      verifiedAt: '2026-01-15',
      legalBasis: 'Pasal 79A (Bebas biaya penerbitan dokumen kependudukan)',
    },
    {
      id: 'permendagri-108-2019',
      title: 'Permendagri No. 108 Tahun 2019',
      sourceName: 'Ditjen Dukcapil',
      sourceUrl: 'https://dukcapil.kemendagri.go.id',
      verifiedAt: '2026-01-15',
      legalBasis: 'Pasal 11 (Persyaratan penerbitan KK baru, perubahan, hilang, rusak)',
    },
  ],
  questions: [
    {
      id: 'keperluan_kk',
      title: 'Apa alasan pengurusan Kartu Keluarga Anda?',
      description: 'Pilih situasi yang paling mewakili pengajuan Anda.',
      options: [
        {
          id: 'menikah_baru',
          label: 'Membentuk Keluarga Baru (Setelah Pernikahan / Pecah KK Suami-Istri)',
          value: 'menikah_baru',
        },
        {
          id: 'tambah_anak',
          label: 'Penambahan Anggota Baru (Kelahiran Bayi / Anak Baru Lahir)',
          value: 'tambah_anak',
        },
        {
          id: 'ubah_elemen_data',
          label: 'Perubahan Data Elemen (Pendidikan, Pekerjaan, Gelar, Agama)',
          value: 'ubah_elemen_data',
        },
        {
          id: 'hilang',
          label: 'Kartu Keluarga Hilang',
          value: 'hilang',
        },
        {
          id: 'rusak',
          label: 'Kartu Keluarga Fisik Rusak / Robek',
          value: 'rusak',
        },
      ],
      defaultValue: 'menikah_baru',
    },
  ],
  baseRequirementIds: ['formulir_f101'],
  allRequirements: [
    {
      id: 'formulir_f101',
      title: 'Formulir Permohonan KK (F-1.01)',
      description: 'Formulir permohonan data kependudukan yang diisi dan ditandatangani pemohon.',
      isMandatory: true,
      notes: 'Bisa didapatkan langsung di loket pelayanan atau diunduh dari situs Dukcapil.',
    },
    {
      id: 'buku_nikah_perkawinan',
      title: 'Buku Nikah / Kutipan Akta Perkawinan',
      description: 'Fotokopi Buku Nikah (bagi muslim) atau Akta Perkawinan dari Pencatatan Sipil (non-muslim).',
      isMandatory: false,
      notes: 'Wajib dibawa untuk pengajuan KK baru bagi pasangan yang baru melangsungkan perkawinan.',
    },
    {
      id: 'kk_lama_kedua_orangtua',
      title: 'Fotokopi KK Orang Tua Masing-Masing',
      description: 'KK asal dari pihak suami dan pihak istri untuk penghapusan data dari KK lama.',
      isMandatory: false,
      notes: 'Dibutuhkan agar data tidak ganda pada sistem kependudukan nasional (SIAK).',
    },
    {
      id: 'surat_keterangan_lahir',
      title: 'Surat Keterangan Kelahiran dari RS / Bidan',
      description: 'Surat kelahiran asli dari fasilitas kesehatan yang menangani persalinan.',
      isMandatory: false,
      notes: 'Diperlukan untuk penerbitan NIK bayi dan penambahan nama di Kartu Keluarga.',
    },
    {
      id: 'dokumen_pendukung_perubahan',
      title: 'Dokumen Pendukung Perubahan Data (Ijazah / SK Kerja)',
      description: 'Fotokopi ijazah terakhir jika ubah pendidikan, atau SK penugasan jika ubah pekerjaan.',
      isMandatory: false,
      notes: 'Dokumen pembuktian data baru yang ingin diubah.',
    },
    {
      id: 'surat_kehilangan_polisi_kk',
      title: 'Surat Keterangan Kehilangan dari Kepolisian',
      description: 'Surat tanda laporan kehilangan dari kantor Polsek/Polres setempat.',
      isMandatory: false,
      notes: 'Wajib jika Kartu Keluarga hilang.',
    },
    {
      id: 'fisik_kk_rusak',
      title: 'Fisik Kartu Keluarga yang Rusak',
      description: 'Membawa fisik KK yang robek/rusak untuk diserahkan ke loket Dukcapil.',
      isMandatory: false,
      notes: 'Untuk penarikan dan penggantian berkas fisik yang baru.',
    },
  ],
  rules: [
    {
      id: 'rule_kk_menikah',
      questionId: 'keperluan_kk',
      operator: 'equals',
      value: 'menikah_baru',
      requirementIds: ['buku_nikah_perkawinan', 'kk_lama_kedua_orangtua'],
    },
    {
      id: 'rule_kk_tambah_anak',
      questionId: 'keperluan_kk',
      operator: 'equals',
      value: 'tambah_anak',
      requirementIds: ['surat_keterangan_lahir'],
    },
    {
      id: 'rule_kk_ubah_data',
      questionId: 'keperluan_kk',
      operator: 'equals',
      value: 'ubah_elemen_data',
      requirementIds: ['dokumen_pendukung_perubahan'],
    },
    {
      id: 'rule_kk_hilang',
      questionId: 'keperluan_kk',
      operator: 'equals',
      value: 'hilang',
      requirementIds: ['surat_kehilangan_polisi_kk'],
    },
    {
      id: 'rule_kk_rusak',
      questionId: 'keperluan_kk',
      operator: 'equals',
      value: 'rusak',
      requirementIds: ['fisik_kk_rusak'],
    },
  ],
};
