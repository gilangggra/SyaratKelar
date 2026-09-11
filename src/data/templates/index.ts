import { DocumentTemplate } from '@/types';

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'sptjm-kelahiran',
    slug: 'sptjm-kelahiran',
    title: 'SPTJM Kebenaran Data Kelahiran',
    officialCode: 'Formulir F-2.03',
    description:
      'Surat Pernyataan Tanggung Jawab Mutlak sebagai pengganti surat keterangan kelahiran dari dokter/bidan bagi pengurusan Akta Kelahiran.',
    legalBasis: 'Permendagri No. 108 Tahun 2019 & Perpres No. 96 Tahun 2018',
    destinationAgency: 'Dinas Kependudukan dan Pencatatan Sipil',
    fields: [
      {
        id: 'nama_pemohon',
        label: 'Nama Lengkap Pemohon (Orang Tua / Wali)',
        type: 'text',
        placeholder: 'Contoh: Ahmad Hidayat',
        required: true,
      },
      {
        id: 'nik_pemohon',
        label: 'NIK Pemohon',
        type: 'text',
        placeholder: '16 digit NIK sesuai KTP',
        required: true,
      },
      {
        id: 'pekerjaan_pemohon',
        label: 'Pekerjaan Pemohon',
        type: 'text',
        placeholder: 'Contoh: Karyawan Swasta / Wiraswasta',
        required: true,
      },
      {
        id: 'alamat_pemohon',
        label: 'Alamat Domisili Lengkap',
        type: 'textarea',
        placeholder: 'Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten',
        required: true,
      },
      {
        id: 'nama_anak',
        label: 'Nama Lengkap Anak',
        type: 'text',
        placeholder: 'Nama anak yang dimohonkan akta lahir',
        required: true,
      },
      {
        id: 'tempat_lahir_anak',
        label: 'Tempat Lahir Anak',
        type: 'text',
        placeholder: 'Kota / Kabupaten tempat lahir',
        required: true,
      },
      {
        id: 'tanggal_lahir_anak',
        label: 'Tanggal Lahir Anak',
        type: 'date',
        required: true,
      },
      {
        id: 'nama_ibu_kandung',
        label: 'Nama Lengkap Ibu Kandung',
        type: 'text',
        required: true,
      },
      {
        id: 'nama_ayah_kandung',
        label: 'Nama Lengkap Ayah Kandung',
        type: 'text',
        required: true,
      },
      {
        id: 'nama_saksi_1',
        label: 'Nama Lengkap Saksi I',
        type: 'text',
        placeholder: 'Nama saksi yang mengetahui kelahiran',
        required: true,
      },
      {
        id: 'nama_saksi_2',
        label: 'Nama Lengkap Saksi II',
        type: 'text',
        placeholder: 'Nama saksi yang mengetahui kelahiran',
        required: true,
      },
    ],
  },
  {
    id: 'sptjm-suami-istri',
    slug: 'sptjm-suami-istri',
    title: 'SPTJM Kebenaran Pasangan Suami Istri',
    officialCode: 'Formulir F-2.04',
    description:
      'Surat pernyataan kebenaran ikatan perkawinan bagi pasangan yang belum memiliki Buku Nikah / Akta Perkawinan resmi saat mencatatkan akta anak.',
    legalBasis: 'Permendagri No. 108 Tahun 2019',
    destinationAgency: 'Dinas Kependudukan dan Pencatatan Sipil',
    fields: [
      {
        id: 'nama_suami',
        label: 'Nama Lengkap Suami',
        type: 'text',
        required: true,
      },
      {
        id: 'nik_suami',
        label: 'NIK Suami',
        type: 'text',
        placeholder: '16 digit NIK',
        required: true,
      },
      {
        id: 'nama_istri',
        label: 'Nama Lengkap Istri',
        type: 'text',
        required: true,
      },
      {
        id: 'nik_istri',
        label: 'NIK Istri',
        type: 'text',
        placeholder: '16 digit NIK',
        required: true,
      },
      {
        id: 'alamat_pasangan',
        label: 'Alamat Tempat Tinggal Bersama',
        type: 'textarea',
        required: true,
      },
      {
        id: 'tanggal_pernikahan',
        label: 'Tanggal Dilangsungkannya Pernikahan',
        type: 'date',
        required: true,
      },
      {
        id: 'nama_saksi_1',
        label: 'Nama Saksi Pernikahan I',
        type: 'text',
        required: true,
      },
      {
        id: 'nama_saksi_2',
        label: 'Nama Saksi Pernikahan II',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'pernyataan-tidak-mampu',
    slug: 'pernyataan-tidak-mampu',
    title: 'Surat Pernyataan Tidak Mampu Mandiri',
    officialCode: 'Lampiran Pengajuan SKTM',
    description:
      'Surat pernyataan mandiri bermaterai mengenai kondisi sosial ekonomi keluarga yang diajukan ke Kelurahan/Desa untuk penerbitan SKTM.',
    legalBasis: 'Standar Pelayanan Publik Administrasi Kelurahan / Desa',
    destinationAgency: 'Kantor Kelurahan / Kantor Desa Setempat',
    fields: [
      {
        id: 'nama_pemohon',
        label: 'Nama Lengkap Kepala Keluarga / Pemohon',
        type: 'text',
        required: true,
      },
      {
        id: 'nik_pemohon',
        label: 'NIK Pemohon',
        type: 'text',
        required: true,
      },
      {
        id: 'pekerjaan',
        label: 'Pekerjaan / Sumber Penghasilan',
        type: 'text',
        placeholder: 'Contoh: Buruh Harian Lepas / Pedagang Asongan',
        required: true,
      },
      {
        id: 'alamat',
        label: 'Alamat Domisili Lengkap',
        type: 'textarea',
        required: true,
      },
      {
        id: 'jumlah_tanggungan',
        label: 'Jumlah Anggota Keluarga yang Ditanggung',
        type: 'text',
        placeholder: 'Contoh: 4 orang (Istri dan 3 orang anak)',
        required: true,
      },
      {
        id: 'keperluan_sktm',
        label: 'Keperluan Pembuatan SKTM',
        type: 'text',
        placeholder: 'Contoh: Persyaratan KIP Kuliah / Keringanan Biaya Pendidikan',
        required: true,
      },
    ],
  },
  {
    id: 'pernyataan-kehilangan-ktp-almarhum',
    slug: 'pernyataan-kehilangan-ktp-almarhum',
    title: 'Surat Pernyataan Kehilangan KTP Almarhum',
    officialCode: 'Lampiran Akta Kematian',
    description:
      'Surat pernyataan ahli waris bermaterai mengenai fisik KTP almarhum/almarhumah yang hilang atau tidak ditemukan saat pelaporan kematian.',
    legalBasis: 'Permendagri No. 108 Tahun 2019 Pasal 44',
    destinationAgency: 'Dinas Kependudukan dan Pencatatan Sipil',
    fields: [
      {
        id: 'nama_pelapor',
        label: 'Nama Lengkap Ahli Waris / Pelapor',
        type: 'text',
        required: true,
      },
      {
        id: 'nik_pelapor',
        label: 'NIK Pelapor',
        type: 'text',
        required: true,
      },
      {
        id: 'hubungan_keluarga',
        label: 'Hubungan Keluarga dengan Almarhum',
        type: 'text',
        placeholder: 'Contoh: Anak Kandung / Istri / Suami',
        required: true,
      },
      {
        id: 'nama_almarhum',
        label: 'Nama Lengkap Almarhum/Almarhumah',
        type: 'text',
        required: true,
      },
      {
        id: 'nik_almarhum',
        label: 'NIK Almarhum (Sesuai Kartu Keluarga)',
        type: 'text',
        required: true,
      },
      {
        id: 'tanggal_kematian',
        label: 'Tanggal Meninggal Dunia',
        type: 'date',
        required: true,
      },
    ],
  },
];

export function getTemplateBySlug(slug: string): DocumentTemplate | undefined {
  return DOCUMENT_TEMPLATES.find((t) => t.slug === slug || t.id === slug);
}
