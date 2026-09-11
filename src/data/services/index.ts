export * from './registry';
export * from './items/ktp';
export * from './items/kartu-keluarga';
export * from './items/pindah-domisili';
export * from './items/akta-kelahiran';
export * from './items/akta-kematian';
export * from './items/sku';
export * from './items/sktm';
export * from './items/surat-ahli-waris';

import { ServiceCategory } from '@/types';

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
}

export const INITIAL_SERVICES: ServiceSummary[] = [
  {
    id: 'ktp',
    slug: 'ktp',
    name: 'KTP Elektronik (KTP-el)',
    shortDescription:
      'Pembuatan baru usia 17 tahun, penggantian KTP rusak, atau penerbitan karena KTP hilang.',
    category: 'kependudukan',
    categoryLabel: 'Administrasi Kependudukan',
    destinationAgency: 'Disdukcapil / Kecamatan / Kelurahan',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: true,
  },
  {
    id: 'kartu-keluarga',
    slug: 'kartu-keluarga',
    name: 'Kartu Keluarga (KK)',
    shortDescription:
      'Pembuatan KK baru setelah menikah, penambahan anggota keluarga, atau perubahan data elemen.',
    category: 'kependudukan',
    categoryLabel: 'Administrasi Kependudukan',
    destinationAgency: 'Disdukcapil / Kecamatan',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: true,
  },
  {
    id: 'pindah-domisili',
    slug: 'pindah-domisili',
    name: 'Surat Pindah Domisili (SKPWNI)',
    shortDescription:
      'Surat keterangan pindah antar kelurahan, kecamatan, kabupaten/kota, atau antar provinsi.',
    category: 'kependudukan',
    categoryLabel: 'Administrasi Kependudukan',
    destinationAgency: 'Disdukcapil / Kelurahan Asal',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: true,
  },
  {
    id: 'akta-kelahiran',
    slug: 'akta-kelahiran',
    name: 'Akta Kelahiran',
    shortDescription:
      'Penerbitan kutipan akta kelahiran untuk bayi baru lahir hingga pelaporan terlambat.',
    category: 'pencatatan_sipil',
    categoryLabel: 'Pencatatan Sipil',
    destinationAgency: 'Disdukcapil / Kelurahan',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: true,
  },
  {
    id: 'akta-kematian',
    slug: 'akta-kematian',
    name: 'Akta Kematian',
    shortDescription:
      'Pencatatan kematian warga di rumah sakit atau di rumah untuk pemutakhiran data kependudukan.',
    category: 'pencatatan_sipil',
    categoryLabel: 'Pencatatan Sipil',
    destinationAgency: 'Disdukcapil / Kelurahan',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: true,
  },
  {
    id: 'sku',
    slug: 'sku',
    name: 'Surat Keterangan Usaha (SKU)',
    shortDescription:
      'Surat keterangan resmi dari kelurahan untuk keperluan pengajuan pinjaman modal atau legalitas usaha mikro.',
    category: 'keterangan_kelurahan',
    categoryLabel: 'Pelayanan Kelurahan',
    destinationAgency: 'Kantor Kelurahan / Desa',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: false,
  },
  {
    id: 'sktm',
    slug: 'sktm',
    name: 'Surat Keterangan Tidak Mampu (SKTM)',
    shortDescription:
      'Keterangan kondisi ekonomi untuk beasiswa pendidikan, jaminan kesehatan, atau keringanan biaya.',
    category: 'keterangan_kelurahan',
    categoryLabel: 'Pelayanan Kelurahan',
    destinationAgency: 'Kantor Kelurahan / Desa & Dinsos',
    isFree: true,
    officialFeeText: 'Gratis Rp0',
    popular: false,
  },
  {
    id: 'surat-ahli-waris',
    slug: 'surat-ahli-waris',
    name: 'Surat Keterangan Ahli Waris',
    shortDescription:
      'Keterangan penunjukan hak waris atas harta peninggalan almarhum/almarhumah yang disahkan pejabat wilayah.',
    category: 'keterangan_kelurahan',
    categoryLabel: 'Pelayanan Kelurahan',
    destinationAgency: 'Kelurahan & Kecamatan',
    isFree: true,
    officialFeeText: 'Gratis Rp0 (di luar materai)',
    popular: false,
  },
];
