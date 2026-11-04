export * from './registry';
export * from './items/ktp';
export * from './items/kartu-keluarga';
export * from './items/pindah-domisili';
export * from './items/akta-kelahiran';
export * from './items/akta-kematian';
export * from './items/sku';
export * from './items/sktm';
export * from './items/surat-ahli-waris';

import { ServiceCategory, LifeEventBundle } from '@/types';

export interface ServiceSummary {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: ServiceCategory;
  categoryLabel: string;
  destinationAgency: string;
  isFree: boolean;
  officialFeeText: string;
  popular?: boolean;
  keywords?: string[];
}

export const INITIAL_SERVICES: ServiceSummary[] = [
  {
    id: 'ktp',
    slug: 'ktp',
    name: 'KTP Elektronik (KTP-el)',
    shortDescription:
      'Pembuatan baru usia 17 tahun, penggantian KTP rusak, penerbitan karena hilang, atau ubah status.',
    category: 'kependudukan',
    categoryLabel: 'Administrasi Kependudukan',
    destinationAgency: 'Disdukcapil / Kecamatan / Kelurahan',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: true,
    keywords: ['ktp hilang', 'ktp rusak', 'rekam 17 tahun', 'ganti status kawin', 'luar domisili', 'ikd'],
  },
  {
    id: 'kartu-keluarga',
    slug: 'kartu-keluarga',
    name: 'Kartu Keluarga (KK)',
    shortDescription:
      'Pembuatan KK baru setelah menikah, penambahan/pengurangan anggota keluarga, atau perubahan data elemen.',
    category: 'kependudukan',
    categoryLabel: 'Administrasi Kependudukan',
    destinationAgency: 'Disdukcapil / Kecamatan',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: true,
    keywords: ['pecah kk', 'menikah baru', 'tambah anak bayi', 'ubah pendidikan pekerjaan', 'kk hilang'],
  },
  {
    id: 'pindah-domisili',
    slug: 'pindah-domisili',
    name: 'Surat Pindah Domisili (SKPWNI)',
    shortDescription:
      'Surat keterangan pindah antar kelurahan, kecamatan, kabupaten/kota, atau antar provinsi tanpa pengantar RT/RW.',
    category: 'kependudukan',
    categoryLabel: 'Administrasi Kependudukan',
    destinationAgency: 'Disdukcapil / Kelurahan Asal',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: true,
    keywords: ['pindah alamat', 'skpwni', 'pindah kota provinsi', 'mutasi ktp kk', 'numpang kk'],
  },
  {
    id: 'akta-kelahiran',
    slug: 'akta-kelahiran',
    name: 'Akta Kelahiran',
    shortDescription:
      'Penerbitan kutipan akta kelahiran untuk bayi baru lahir hingga pelaporan terlambat/dewasa.',
    category: 'pencatatan_sipil',
    categoryLabel: 'Pencatatan Sipil',
    destinationAgency: 'Disdukcapil / Kelurahan',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: true,
    keywords: ['akta lahir bayi', 'nikah siri', 'sptjm kelahiran', 'surat bidan hilang', 'anak baru lahir'],
  },
  {
    id: 'akta-kematian',
    slug: 'akta-kematian',
    name: 'Akta Kematian',
    shortDescription:
      'Pencatatan kematian warga di rumah sakit atau di rumah untuk pemutakhiran KK dan pengurusan waris.',
    category: 'pencatatan_sipil',
    categoryLabel: 'Pencatatan Sipil',
    destinationAgency: 'Disdukcapil / Kelurahan',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: true,
    keywords: ['surat kematian', 'orang meninggal', 'ktp almarhum hilang', 'klaim taspen bpjs'],
  },
  {
    id: 'sku',
    slug: 'sku',
    name: 'Surat Keterangan Usaha (SKU)',
    shortDescription:
      'Surat keterangan resmi dari kelurahan untuk keperluan pengajuan pinjaman modal KUR atau legalitas UMKM.',
    category: 'keterangan_kelurahan',
    categoryLabel: 'Pelayanan Kelurahan',
    destinationAgency: 'Kantor Kelurahan / Desa',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: false,
    keywords: ['kur bank bri mandiri', 'pinjaman modal usaha', 'umkm warung', 'nib'],
  },
  {
    id: 'sktm',
    slug: 'sktm',
    name: 'Surat Keterangan Tidak Mampu (SKTM)',
    shortDescription:
      'Keterangan kondisi ekonomi untuk beasiswa pendidikan (KIP Kuliah), jaminan kesehatan (BPJS PBI), atau keringanan biaya.',
    category: 'keterangan_kelurahan',
    categoryLabel: 'Pelayanan Kelurahan',
    destinationAgency: 'Kantor Kelurahan / Desa & Dinsos',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: false,
    keywords: ['kip kuliah', 'beasiswa sekolah', 'keringanan ukt spp', 'bpjs pbi rumah sakit', 'dtks'],
  },
  {
    id: 'surat-ahli-waris',
    slug: 'surat-ahli-waris',
    name: 'Surat Keterangan Ahli Waris',
    shortDescription:
      'Keterangan penunjukan hak waris atas harta peninggalan almarhum/almarhumah yang disahkan Lurah & Camat.',
    category: 'keterangan_kelurahan',
    categoryLabel: 'Pelayanan Kelurahan',
    destinationAgency: 'Kelurahan & Kecamatan',
    isFree: true,
    officialFeeText: 'Gratis Rp0 (di luar materai)',
    popular: false,
    keywords: ['warisan', 'cairkan tabungan bank almarhum', 'balik nama sertifikat tanah waris', 'silsilah waris'],
  },
];

/**
 * Paket Peristiwa Kehidupan (Life-Event Bundles)
 * Membantu warga memahami urutan logis pengurusan beberapa dokumen yang saling berkaitan.
 */
export const LIFE_EVENT_BUNDLES: LifeEventBundle[] = [
  {
    id: 'paket-kelahiran-anak',
    title: 'Kelahiran Buah Hati',
    subtitle: 'Urutan mengurus dokumen bayi baru lahir',
    description:
      'Saat anak lahir, daftarkan nama anak ke Kartu Keluarga untuk mendapatkan NIK sekaligus menerbitkan Akta Kelahiran.',
    badgeText: '2 Layanan Terpadu',
    steps: [
      {
        order: 1,
        serviceSlug: 'kartu-keluarga',
        serviceName: 'Tambah Anggota di KK (NIK Bayi)',
        roleDescription: 'Mendaftarkan kelahiran bayi agar mendapatkan NIK pada Kartu Keluarga.',
        presetAnswers: { keperluan_kk: 'tambah_anak' },
      },
      {
        order: 2,
        serviceSlug: 'akta-kelahiran',
        serviceName: 'Akta Kelahiran Anak',
        roleDescription: 'Menerbitkan kutipan Akta Kelahiran resmi (dapat diurus sekaligus dengan KK).',
        presetAnswers: { bukti_kelahiran: 'ada_medis', status_perkawinan_ortu: 'nikah_resmi' },
      },
    ],
  },
  {
    id: 'paket-menikah-baru',
    title: 'Menikah & Keluarga Baru',
    subtitle: 'Urutan pecah KK & pembaruan status KTP',
    description:
      'Pasangan yang baru menikah perlu memisahkan diri dari KK orang tua, mengurus surat pindah jika beda domisili, dan memperbarui status KTP-el.',
    badgeText: '3 Layanan Berurutan',
    steps: [
      {
        order: 1,
        serviceSlug: 'pindah-domisili',
        serviceName: 'Surat Pindah (Jika Pindah Alamat)',
        roleDescription: 'Jika salah satu pasangan pindah domisili mengikuti pasangan.',
        presetAnswers: {
          cakupan_pindah: 'antar_kabupaten_provinsi',
          anggota_pindah: 'sebagian_keluarga',
          pengurusan_oleh: 'sendiri',
        },
      },
      {
        order: 2,
        serviceSlug: 'kartu-keluarga',
        serviceName: 'Buat Kartu Keluarga (KK) Baru',
        roleDescription: 'Pecah KK dari orang tua masing-masing menjadi KK mandiri suami-istri.',
        presetAnswers: { keperluan_kk: 'menikah_baru' },
      },
      {
        order: 3,
        serviceSlug: 'ktp',
        serviceName: 'Cetak KTP-el Status Kawin',
        roleDescription: 'Memperbarui status perkawinan dan alamat baru pada KTP-el.',
        presetAnswers: { alasan_pengurusan: 'ubah_data' },
      },
    ],
  },
  {
    id: 'paket-kedukaan-waris',
    title: 'Kedukaan & Pengurusan Waris',
    subtitle: 'Dari pelaporan kematian hingga hak ahli waris',
    description:
      'Surat Keterangan Ahli Waris untuk perbankan/BPN mewajibkan adanya Akta Kematian dan KK yang telah diperbarui terlebih dahulu.',
    badgeText: '2 Tahap Wajib',
    steps: [
      {
        order: 1,
        serviceSlug: 'akta-kematian',
        serviceName: 'Akta Kematian & Pembaruan KK',
        roleDescription: 'Urus Akta Kematian di Disdukcapil terlebih dahulu (otomatis memperbarui KK).',
        presetAnswers: {
          lokasi_meninggal: 'rumah_sakit',
          kondisi_ktp_almarhum: 'ada_ktp',
          hubungan_kk_pelapor: 'satu_kk',
        },
      },
      {
        order: 2,
        serviceSlug: 'surat-ahli-waris',
        serviceName: 'Surat Keterangan Ahli Waris',
        roleDescription: 'Mengurus pengesahan silsilah dan hak waris di Kelurahan & Kecamatan.',
        presetAnswers: {
          usia_ahli_waris: 'semua_dewasa',
          status_kematian_ahli_waris: 'semua_hidup',
          keperluan_waris: 'perbankan_taspen',
        },
      },
    ],
  },
  {
    id: 'paket-dokumen-hilang',
    title: 'Dompet / Dokumen Hilang',
    subtitle: 'Kehilangan KTP & Kartu Keluarga',
    description:
      'Jika kehilangan KTP sekaligus KK, buat surat kehilangan di Polsek terlebih dahulu, lalu cetak KK dan KTP-el.',
    badgeText: '2 Layanan Penting',
    steps: [
      {
        order: 1,
        serviceSlug: 'kartu-keluarga',
        serviceName: 'Cetak Ulang Kartu Keluarga Hilang',
        roleDescription: 'Meminta penerbitan ulang KK sebagai dasar verifikasi NIK.',
        presetAnswers: { keperluan_kk: 'hilang' },
      },
      {
        order: 2,
        serviceSlug: 'ktp',
        serviceName: 'Cetak Ulang KTP-el Hilang',
        roleDescription: 'Mencetak fisik KTP-el baru dengan melampirkan surat kehilangan kepolisian.',
        presetAnswers: { alasan_pengurusan: 'hilang', lokasi_pengurusan: 'domisili_asal' },
      },
    ],
  },
];
