import { Service } from '@/types';

export const suratAhliWarisService: Service = {
  id: 'surat-ahli-waris',
  slug: 'surat-ahli-waris',
  name: 'Surat Keterangan Ahli Waris',
  shortDescription:
    'Surat keterangan resmi penetapan hubungan darah dan hak waris yang disahkan oleh Kepala Kelurahan/Desa dan Camat.',
  fullDescription:
    'Surat Keterangan Ahli Waris (SKW) bagi WNI penduduk pribumi dibuat oleh para ahli waris dengan diketahui dan disahkan oleh Lurah serta Camat setempat. Surat ini dibutuhkan untuk pencairan tabungan almarhum di bank, pengalihan sertifikat tanah/rumah di BPN, balik nama kendaraan, atau klaim jaminan hari tua (Taspen/BPJS Ketenagakerjaan).',
  category: 'keterangan_kelurahan',
  categoryLabel: 'Pelayanan Kelurahan',
  destinationAgency: 'Kantor Kelurahan & Kantor Kecamatan Setempat',
  estimatedTime: '2 - 5 hari kerja (melalui proses verifikasi berkas di Kelurahan lalu registrasi di Kecamatan)',
  fees: {
    isFree: true,
    officialAmount: 0,
    currency: 'IDR',
    description: 'Pengesahan Surat Keterangan Ahli Waris di Kelurahan dan Kecamatan adalah GRATIS (Rp0). Pemohon hanya menyediakan materai fisik Rp10.000.',
    legalReference: 'Surat Edaran Mahkamah Agung & Peraturan Pelayanan Wilayah',
  },
  sources: [
    {
      id: 'sema-ahli-waris',
      title: 'Pedoman Penataan dan Pengesahan Keterangan Hak Waris',
      sourceName: 'Mahkamah Agung & Ditjen Administrasi Hukum Umum',
      sourceUrl: 'https://ahu.go.id',
      verifiedAt: '2026-01-15',
      legalBasis: 'Kewenangan legalitas surat keterangan waris bagi golongan WNI pribumi',
    },
    {
      id: 'sop-waris-kecamatan',
      title: 'Standar Pelayanan Penerbitan dan Pengesahan Surat Ahli Waris Wilayah',
      sourceName: 'Pemerintah Daerah (Kecamatan & Kelurahan)',
      verifiedAt: '2026-01-15',
      legalBasis: 'Pengesahan tanpa retribusi daerah',
    },
  ],
  questions: [
    {
      id: 'usia_ahli_waris',
      title: 'Apakah seluruh ahli waris sudah berusia dewasa (18 tahun ke atas)?',
      description: 'Anak di bawah umur belum cakap hukum untuk menandatangani pelepasan/penerimaan warisan.',
      options: [
        {
          id: 'semua_dewasa',
          label: 'Ya, Seluruh Ahli Waris Sudah Dewasa (18 tahun ke atas / sudah menikah)',
          value: 'semua_dewasa',
        },
        {
          id: 'ada_anak_di_bawah_umur',
          label: 'Ada Ahli Waris yang Masih di Bawah Umur (Kurang dari 18 tahun)',
          value: 'ada_anak_di_bawah_umur',
        },
      ],
      defaultValue: 'semua_dewasa',
    },
    {
      id: 'status_kematian_ahli_waris',
      title: 'Apakah ada ahli waris yang telah meninggal dunia lebih dulu?',
      description: 'Menentukan apakah berlaku aturan waris pengganti (turun waris ke cucu).',
      options: [
        {
          id: 'semua_hidup',
          label: 'Tidak Ada (Seluruh anak kandung/ahli waris masih hidup)',
          value: 'semua_hidup',
        },
        {
          id: 'ada_yang_meninggal',
          label: 'Ada Ahli Waris yang Telah Meninggal Dunia',
          value: 'ada_yang_meninggal',
        },
      ],
      defaultValue: 'semua_hidup',
    },
  ],
  baseRequirementIds: [
    'akta_kematian_pewaris',
    'buku_nikah_pewaris',
    'ktp_kk_semua_waris',
    'bagan_silsilah_waris',
    'ktp_dua_saksi_waris',
  ],
  allRequirements: [
    {
      id: 'akta_kematian_pewaris',
      title: 'Kutipan Akta Kematian Almarhum Pewaris',
      description: 'Akta kematian resmi yang diterbitkan oleh Dinas Dukcapil.',
      isMandatory: true,
      notes: 'Wajib ada sebagai bukti sah terbukanya hak pewarisan.',
    },
    {
      id: 'buku_nikah_pewaris',
      title: 'Buku Nikah / Akta Perkawinan Almarhum Pewaris',
      description: 'Salinan buku nikah KUA atau akta perkawinan catatan sipil almarhum ayah dan ibu.',
      isMandatory: true,
      notes: 'Membuktikan status perkawinan sah orang tua dari para ahli waris.',
    },
    {
      id: 'ktp_kk_semua_waris',
      title: 'Fotokopi KTP-el dan Kartu Keluarga (KK) Seluruh Ahli Waris',
      description: 'Salinan identitas lengkap seluruh anak kandung dan pasangan yang masih hidup.',
      isMandatory: true,
      notes: 'Semua nama anak harus dapat dicocokkan dengan data pada akta kelahiran masing-masing.',
    },
    {
      id: 'bagan_silsilah_waris',
      title: 'Bagan Silsilah Ahli Waris Bermaterai Rp10.000',
      description: 'Gambar bagan garis keturunan yang ditandatangani oleh seluruh ahli waris di atas materai.',
      isMandatory: true,
      notes: 'Format bagan silsilah disahkan oleh Ketua RT dan RW setempat sebelum diajukan ke Kelurahan.',
    },
    {
      id: 'ktp_dua_saksi_waris',
      title: 'Fotokopi KTP-el 2 (Dua) Orang Saksi',
      description: 'KTP saksi yang mengetahui silsilah keluarga (umumnya Ketua RT dan RW atau kerabat dekat).',
      isMandatory: true,
      notes: 'Saksi menandatangani lembar kesaksian silsilah ahli waris.',
    },
    {
      id: 'penetapan_wali_waris',
      title: 'Surat Penetapan Perwalian Anak dari Pengadilan',
      description: 'Penetapan perwalian anak dari Pengadilan Agama (bagi muslim) atau Pengadilan Negeri (non-muslim).',
      isMandatory: false,
      notes: 'Diperlukan untuk mewakili tanda tangan anak di bawah umur dalam urusan perbankan/jual beli tanah waris.',
    },
    {
      id: 'akta_kematian_ahli_waris_lama',
      title: 'Akta Kematian Ahli Waris yang Telah Meninggal Lebih Dulu',
      description: 'Fotokopi akta kematian anak pewaris yang telah wafat mendahului.',
      isMandatory: false,
      notes: 'Hak warisnya diteruskan kepada anak-anaknya (cucu pewaris) sebagai ahli waris pengganti.',
    },
  ],
  rules: [
    {
      id: 'rule_anak_bawah_umur',
      questionId: 'usia_ahli_waris',
      operator: 'equals',
      value: 'ada_anak_di_bawah_umur',
      requirementIds: ['penetapan_wali_waris'],
    },
    {
      id: 'rule_ada_waris_meninggal',
      questionId: 'status_kematian_ahli_waris',
      operator: 'equals',
      value: 'ada_yang_meninggal',
      requirementIds: ['akta_kematian_ahli_waris_lama'],
    },
  ],
};
