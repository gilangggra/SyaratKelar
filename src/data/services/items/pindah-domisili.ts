import { Service } from '@/types';

export const pindahDomisiliService: Service = {
  id: 'pindah-domisili',
  slug: 'pindah-domisili',
  name: 'Surat Pindah Domisili (SKPWNI)',
  shortDescription:
    'Penerbitan Surat Keterangan Pindah Warga Negara Indonesia (SKPWNI) antar kelurahan, kecamatan, kabupaten/kota, atau antar provinsi.',
  fullDescription:
    'Surat Keterangan Pindah Warga Negara Indonesia (SKPWNI) diterbitkan oleh Dinas Kependudukan dan Pencatatan Sipil untuk warga yang berpindah tempat tinggal. Berdasarkan Perpres 96/2018 dan Permendagri 108/2019, pengurusan surat pindah TIDAK LAGI memerlukan surat pengantar dari RT/RW.',
  category: 'kependudukan',
  categoryLabel: 'Administrasi Kependudukan',
  destinationAgency: 'Disdukcapil / Kantor Kelurahan Asal',
  estimatedTime: '1 - 2 hari kerja (SKPWNI dapat diterbitkan secara digital dengan barcode TTE)',
  fees: {
    isFree: true,
    officialAmount: 0,
    currency: 'IDR',
    description: 'Penerbitan SKPWNI adalah GRATIS (Rp0). Dilarang ada pungutan biaya apapun.',
    legalReference: 'UU No. 24 Tahun 2013 Pasal 79A',
  },
  sources: [
    {
      id: 'perpres-96-2018',
      title: 'Peraturan Presiden Nomor 96 Tahun 2018',
      sourceName: 'JDIH Sekretariat Kabinet',
      sourceUrl: 'https://jdih.setkab.go.id',
      verifiedAt: '2026-01-15',
      legalBasis: 'Pasal 25-30 (Penerbitan SKPWNI tanpa surat pengantar RT/RW)',
    },
    {
      id: 'permendagri-108-2019',
      title: 'Permendagri Nomor 108 Tahun 2019',
      sourceName: 'Ditjen Dukcapil Kemendagri',
      sourceUrl: 'https://dukcapil.kemendagri.go.id',
      verifiedAt: '2026-01-15',
      legalBasis: 'Mekanisme dan persyaratan kepindahan penduduk dalam NKRI',
    },
  ],
  questions: [
    {
      id: 'cakupan_pindah',
      title: 'Ke mana wilayah kepindahan domisili Anda?',
      description: 'Cakupan wilayah kepindahan menentukan instansi yang menerbitkan dan format SKPWNI.',
      options: [
        {
          id: 'antar_kabupaten_provinsi',
          label: 'Antar Kabupaten/Kota atau Antar Provinsi',
          description: 'Pindah ke kota/kabupaten yang berbeda atau keluar pulau/provinsi.',
          value: 'antar_kabupaten_provinsi',
        },
        {
          id: 'dalam_satu_kabupaten',
          label: 'Dalam Satu Kabupaten/Kota (Antar Kelurahan/Kecamatan)',
          description: 'Hanya berpindah kelurahan atau kecamatan dalam wilayah kota yang sama.',
          value: 'dalam_satu_kabupaten',
        },
      ],
      defaultValue: 'antar_kabupaten_provinsi',
    },
    {
      id: 'anggota_pindah',
      title: 'Siapa saja anggota keluarga yang berpindah?',
      description: 'Menentukan apakah Kartu Keluarga asal ditarik atau dilakukan pemecahan KK.',
      options: [
        {
          id: 'seluruh_keluarga',
          label: 'Seluruh Anggota Keluarga (Kepala Keluarga beserta seluruh anggota)',
          value: 'seluruh_keluarga',
        },
        {
          id: 'sebagian_keluarga',
          label: 'Sebagian Anggota Keluarga Saja (Kepala keluarga tetap / Anak mandiri)',
          value: 'sebagian_keluarga',
        },
      ],
      defaultValue: 'seluruh_keluarga',
    },
  ],
  baseRequirementIds: ['kk_asli_pindah', 'formulir_f103'],
  allRequirements: [
    {
      id: 'kk_asli_pindah',
      title: 'Kartu Keluarga (KK) Asli Pemohon',
      description: 'Menunjukkan KK asli daerah asal untuk penyesuaian data kependudukan.',
      isMandatory: true,
      notes: 'KK asli daerah asal akan ditarik jika seluruh anggota keluarga pindah.',
    },
    {
      id: 'formulir_f103',
      title: 'Formulir Pendaftaran Pindah Penduduk (F-1.03)',
      description: 'Formulir resmi permohonan pindah yang memuat alamat asal dan alamat tujuan lengkap.',
      isMandatory: true,
      notes: 'Tersedia di loket pelayanan Dukcapil/Kelurahan atau aplikasi online Dukcapil daerah.',
    },
    {
      id: 'ktp_anggota_pindah',
      title: 'KTP-el Seluruh Anggota Keluarga yang Ikut Pindah',
      description: 'Membawa fisik KTP-el asli bagi anggota keluarga yang sudah berusia 17 tahun ke atas.',
      isMandatory: false,
      notes: 'Nantinya di daerah tujuan akan dicetakkan KTP-el baru dengan alamat baru.',
    },
    {
      id: 'surat_kuasa_pindah',
      title: 'Surat Kuasa Pengurusan (Jika Dikuasakan)',
      description: 'Surat kuasa bermaterai Rp10.000 jika kepala keluarga berhalangan dan menguasakan kepada anggota keluarga di dalam KK.',
      isMandatory: false,
      notes: 'Sebaiknya diurus langsung oleh kepala keluarga atau yang bersangkutan.',
    },
  ],
  rules: [
    {
      id: 'rule_pindah_keluarga',
      questionId: 'anggota_pindah',
      operator: 'equals',
      value: 'seluruh_keluarga',
      requirementIds: ['ktp_anggota_pindah'],
    },
  ],
};
