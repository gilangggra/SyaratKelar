import { Service } from '@/types';

export const aktaKematianService: Service = {
  id: 'akta-kematian',
  slug: 'akta-kematian',
  name: 'Akta Kematian',
  shortDescription:
    'Pencatatan kematian warga dan penerbitan kutipan akta kematian untuk pembaharuan Kartu Keluarga dan administrasi waris/asuransi.',
  fullDescription:
    'Akta Kematian adalah dokumen resmi bukti pencatatan peristiwa meninggalnya seseorang yang diterbitkan oleh Dinas Dukcapil. Dokumen ini sangat penting untuk pengurusan penetapan waris, penutupan rekening bank, klaim asuransi/Taspen, dan penghapusan NIK dari Kartu Keluarga.',
  category: 'pencatatan_sipil',
  categoryLabel: 'Pencatatan Sipil',
  destinationAgency: 'Kantor Disdukcapil / Kantor Kelurahan',
  estimatedTime: '1 - 2 hari kerja (diterbitkan digital dengan barcode TTE)',
  fees: {
    isFree: true,
    officialAmount: 0,
    currency: 'IDR',
    description: 'Penerbitan Akta Kematian adalah GRATIS (Rp0). Tidak dipungut biaya apapun.',
    legalReference: 'UU No. 24 Tahun 2013 Pasal 79A',
  },
  sources: [
    {
      id: 'uu-24-2013',
      title: 'Undang-Undang Republik Indonesia Nomor 24 Tahun 2013',
      sourceName: 'JDIH Kemendagri',
      sourceUrl: 'https://peraturan.go.id',
      verifiedAt: '2026-01-15',
      legalBasis: 'Pasal 79A (Bebas biaya penerbitan dokumen pencatatan sipil)',
    },
    {
      id: 'permendagri-108-2019',
      title: 'Permendagri No. 108 Tahun 2019',
      sourceName: 'Ditjen Dukcapil',
      sourceUrl: 'https://dukcapil.kemendagri.go.id',
      verifiedAt: '2026-01-15',
      legalBasis: 'Pasal 42-45 (Persyaratan pencatatan kematian penduduk)',
    },
  ],
  questions: [
    {
      id: 'lokasi_meninggal',
      title: 'Di mana almarhum/almarhumah meninggal dunia?',
      description: 'Menentukan asal penerbitan surat keterangan kematian medis atau administratif.',
      options: [
        {
          id: 'rumah_sakit',
          label: 'Di Rumah Sakit / Fasilitas Kesehatan (Ada surat dokter)',
          value: 'rumah_sakit',
        },
        {
          id: 'rumah_tinggal',
          label: 'Di Rumah / Luar Faskes (Surat dari Kelurahan/Desa)',
          value: 'rumah_tinggal',
        },
      ],
      defaultValue: 'rumah_sakit',
    },
    {
      id: 'kondisi_ktp_almarhum',
      title: 'Apakah fisik KTP-el almarhum/almarhumah tersedia?',
      description: 'Dukcapil menarik fisik KTP orang yang meninggal dunia agar identitas tidak disalahgunakan.',
      options: [
        {
          id: 'ada_ktp',
          label: 'Ada Fisik KTP-el Asli Almarhum',
          value: 'ada_ktp',
        },
        {
          id: 'hilang_ktp',
          label: 'KTP Fisik Hilang / Tidak Ditemukan',
          value: 'hilang_ktp',
        },
      ],
      defaultValue: 'ada_ktp',
    },
  ],
  baseRequirementIds: ['kk_almarhum', 'ktp_pelapor', 'ktp_saksi_kematian'],
  allRequirements: [
    {
      id: 'kk_almarhum',
      title: 'Kartu Keluarga (KK) yang Memuat Nama Almarhum',
      description: 'Menunjukkan KK asli atau fotokopi untuk proses pemutakhiran data kependudukan.',
      isMandatory: true,
      notes: 'Dukcapil akan sekaligus menerbitkan KK baru tanpa nama almarhum.',
    },
    {
      id: 'ktp_pelapor',
      title: 'KTP-el Pelapor (Ahli Waris / Anggota Keluarga)',
      description: 'Fotokopi KTP-el salah satu anggota keluarga yang mengurus pelaporan.',
      isMandatory: true,
    },
    {
      id: 'ktp_saksi_kematian',
      title: 'Fotokopi KTP-el 2 (Dua) Orang Saksi',
      description: 'KTP tetangga atau kerabat yang mengetahui peristiwa kematian.',
      isMandatory: true,
      notes: 'Cukup fotokopi KTP saksi, saksi tidak wajib hadir di loket.',
    },
    {
      id: 'surat_kematian_rs',
      title: 'Surat Keterangan Kematian Asli dari Rumah Sakit / Dokter',
      description: 'Surat resmi dari dokter faskes yang menyatakan tanggal, jam, dan penyebab kematian.',
      isMandatory: false,
      notes: 'Wajib jika meninggal di fasilitas kesehatan.',
    },
    {
      id: 'surat_kematian_kelurahan',
      title: 'Surat Keterangan Kematian dari Kantor Kelurahan / Desa (Formulir F-2.29)',
      description: 'Surat pengantar kematian yang ditandatangani oleh Lurah atau Kepala Desa setempat.',
      isMandatory: false,
      notes: 'Bagi warga yang meninggal dunia di rumah atau di luar fasilitas kesehatan.',
    },
    {
      id: 'fisik_ktp_almarhum',
      title: 'Fisik KTP-el Asli Almarhum/Almarhumah',
      description: 'KTP-el asli diserahkan ke petugas loket untuk ditarik dan dinonaktifkan.',
      isMandatory: false,
      notes: 'Petugas akan melubangi/menarik fisik KTP untuk menghindari penyalahgunaan identitas.',
    },
    {
      id: 'surat_pernyataan_ktp_hilang',
      title: 'Surat Pernyataan Kehilangan KTP Almarhum',
      description: 'Surat pernyataan bermaterai dari ahli waris bahwa KTP almarhum tercecer/hilang.',
      isMandatory: false,
      notes: 'Hanya jika fisik KTP almarhum tidak dapat ditemukan.',
    },
  ],
  rules: [
    {
      id: 'rule_mati_rs',
      questionId: 'lokasi_meninggal',
      operator: 'equals',
      value: 'rumah_sakit',
      requirementIds: ['surat_kematian_rs'],
    },
    {
      id: 'rule_mati_rumah',
      questionId: 'lokasi_meninggal',
      operator: 'equals',
      value: 'rumah_tinggal',
      requirementIds: ['surat_kematian_kelurahan'],
    },
    {
      id: 'rule_ktp_ada',
      questionId: 'kondisi_ktp_almarhum',
      operator: 'equals',
      value: 'ada_ktp',
      requirementIds: ['fisik_ktp_almarhum'],
    },
    {
      id: 'rule_ktp_hilang',
      questionId: 'kondisi_ktp_almarhum',
      operator: 'equals',
      value: 'hilang_ktp',
      requirementIds: ['surat_pernyataan_ktp_hilang'],
    },
  ],
};
