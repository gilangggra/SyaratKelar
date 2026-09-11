import { Service } from '@/types';

export const aktaKelahiranService: Service = {
  id: 'akta-kelahiran',
  slug: 'akta-kelahiran',
  name: 'Akta Kelahiran',
  shortDescription:
    'Pencatatan kelahiran dan penerbitan kutipan akta kelahiran untuk bayi baru lahir hingga penerbitan akta terlambat/dewasa.',
  fullDescription:
    'Akta Kelahiran adalah bukti sah mengenai status dan peristiwa kelahiran seseorang yang diterbitkan oleh Dinas Kependudukan dan Pencatatan Sipil. Penerbitan akta kelahiran tidak dikenai denda keterlambatan (UU No. 24/2013).',
  category: 'pencatatan_sipil',
  categoryLabel: 'Pencatatan Sipil',
  destinationAgency: 'Kantor Disdukcapil / Kantor Kelurahan',
  estimatedTime: '1 - 3 hari kerja (diterbitkan digital dengan barcode TTE, dapat dicetak sendiri di kertas HVS A4 80gr)',
  fees: {
    isFree: true,
    officialAmount: 0,
    currency: 'IDR',
    description: 'Penerbitan Akta Kelahiran adalah GRATIS (Rp0). Tidak ada denda administratif keterlambatan.',
    legalReference: 'UU No. 24 Tahun 2013 Pasal 79A',
  },
  sources: [
    {
      id: 'uu-24-2013',
      title: 'Undang-Undang Republik Indonesia Nomor 24 Tahun 2013',
      sourceName: 'JDIH Kemendagri',
      sourceUrl: 'https://peraturan.go.id',
      verifiedAt: '2026-01-15',
      legalBasis: 'Pasal 79A (Penerbitan akta bebas biaya)',
    },
    {
      id: 'permendagri-108-2019',
      title: 'Permendagri No. 108 Tahun 2019',
      sourceName: 'Ditjen Dukcapil',
      sourceUrl: 'https://dukcapil.kemendagri.go.id',
      verifiedAt: '2026-01-15',
      legalBasis: 'Pasal 32-35 (Persyaratan pencatatan kelahiran WNI)',
    },
  ],
  questions: [
    {
      id: 'bukti_kelahiran',
      title: 'Apakah Anda memiliki surat kelahiran dari dokter/bidan/RS?',
      description: 'Menentukan apakah memerlukan surat keterangan medis atau surat pernyataan tanggung jawab mutlak (SPTJM).',
      options: [
        {
          id: 'ada_medis',
          label: 'Ada Surat Kelahiran dari Rumah Sakit / Bidan / Puskesmas',
          value: 'ada_medis',
        },
        {
          id: 'tidak_ada_medis',
          label: 'Tidak Ada Surat Lahir Medis (Lahir di rumah / Pengurusan usia dewasa)',
          value: 'tidak_ada_medis',
        },
      ],
      defaultValue: 'ada_medis',
    },
    {
      id: 'status_perkawinan_ortu',
      title: 'Bagaimana status pernikahan orang tua anak?',
      description: 'Menentukan dokumen pencatatan hubungan hukum anak dengan orang tua pada akta.',
      options: [
        {
          id: 'nikah_resmi',
          label: 'Menikah Sah Tercatat (Memiliki Buku Nikah KUA / Akta Perkawinan Sipil)',
          value: 'nikah_resmi',
        },
        {
          id: 'nikah_siri',
          label: 'Nikah Siri / Perkawinan Belum Tercatat Resmi di Negara',
          value: 'nikah_siri',
        },
        {
          id: 'ibu_kandung',
          label: 'Anak dari Ibu Kandung Saja (Di luar ikatan perkawinan)',
          value: 'ibu_kandung',
        },
      ],
      defaultValue: 'nikah_resmi',
    },
  ],
  baseRequirementIds: ['kk_orang_tua', 'ktp_orang_tua', 'ktp_dua_saksi'],
  allRequirements: [
    {
      id: 'kk_orang_tua',
      title: 'Kartu Keluarga (KK) Orang Tua',
      description: 'KK yang sudah mencantumkan nama anak (atau diperbarui bersamaan dengan permohonan akta).',
      isMandatory: true,
      notes: 'Bila anak belum masuk KK, Dukcapil akan memproses KK baru dan akta kelahiran secara sekaligus.',
    },
    {
      id: 'ktp_orang_tua',
      title: 'KTP-el Kedua Orang Tua',
      description: 'Fotokopi KTP-el ayah dan ibu kandung pemohon.',
      isMandatory: true,
    },
    {
      id: 'ktp_dua_saksi',
      title: 'KTP-el 2 (Dua) Orang Saksi Kelahiran',
      description: 'Fotokopi KTP saksi yang mengetahui peristiwa kelahiran (keluarga, tetangga, atau kerabat).',
      isMandatory: true,
      notes: 'Saksi tidak harus hadir di loket, cukup melampirkan fotokopi KTP-el saksi yang masih berlaku.',
    },
    {
      id: 'surat_lahir_medis',
      title: 'Surat Keterangan Kelahiran dari RS / Bidan / Faskes',
      description: 'Surat asli keterangan kelahiran yang memuat tanggal, jam, berat, dan penolong persalinan.',
      isMandatory: false,
      notes: 'Wajib disertakan jika persalinan dilakukan di fasilitas kesehatan resmi.',
    },
    {
      id: 'sptjm_kelahiran',
      title: 'SPTJM Kebenaran Data Kelahiran (Formulir F-2.03)',
      description: 'Surat Pernyataan Tanggung Jawab Mutlak bermaterai Rp10.000 dengan diketahui 2 orang saksi.',
      isMandatory: false,
      notes: 'Sebagai pengganti surat keterangan kelahiran medis jika surat dokter/bidan tidak ada.',
    },
    {
      id: 'buku_nikah_ortu',
      title: 'Buku Nikah / Akta Perkawinan Orang Tua',
      description: 'Kutipan Akta Nikah (KUA) atau Akta Perkawinan (Dukcapil) orang tua yang dilegalisir.',
      isMandatory: false,
      notes: 'Membuktikan status anak sebagai anak sah dari pasangan suami-istri.',
    },
    {
      id: 'sptjm_suami_istri',
      title: 'SPTJM Kebenaran Sebagai Pasangan Suami Istri (Formulir F-2.04)',
      description: 'Surat pernyataan bermaterai Rp10.000 yang menyatakan kebenaran ikatan suami-istri.',
      isMandatory: false,
      notes: 'Bagi perkawinan yang belum tercatat resmi pada catatan negara.',
    },
  ],
  rules: [
    {
      id: 'rule_lahir_medis',
      questionId: 'bukti_kelahiran',
      operator: 'equals',
      value: 'ada_medis',
      requirementIds: ['surat_lahir_medis'],
    },
    {
      id: 'rule_lahir_tanpa_medis',
      questionId: 'bukti_kelahiran',
      operator: 'equals',
      value: 'tidak_ada_medis',
      requirementIds: ['sptjm_kelahiran'],
    },
    {
      id: 'rule_nikah_resmi',
      questionId: 'status_perkawinan_ortu',
      operator: 'equals',
      value: 'nikah_resmi',
      requirementIds: ['buku_nikah_ortu'],
    },
    {
      id: 'rule_nikah_siri',
      questionId: 'status_perkawinan_ortu',
      operator: 'equals',
      value: 'nikah_siri',
      requirementIds: ['sptjm_suami_istri'],
    },
  ],
};
