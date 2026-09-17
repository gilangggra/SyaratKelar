import { Service } from '@/types';

export const sktmService: Service = {
  id: 'sktm',
  slug: 'sktm',
  name: 'Surat Keterangan Tidak Mampu (SKTM)',
  shortDescription:
    'Surat keterangan resmi dari kelurahan atau desa untuk pembuktian kondisi ekonomi bagi keperluan beasiswa, jaminan kesehatan, atau keringanan biaya.',
  fullDescription:
    'Surat Keterangan Tidak Mampu (SKTM) diterbitkan oleh Lurah/Kepala Desa untuk warga masyarakat berpenghasilan rendah. Surat ini sering dibutuhkan untuk pendaftaran KIP Kuliah, beasiswa sekolah, pengajuan BPJS Kesehatan PBI, permohonan keringanan biaya rawat inap rumah sakit, atau bantuan hukum.',
  category: 'keterangan_kelurahan',
  categoryLabel: 'Pelayanan Kelurahan',
  destinationAgency: 'Kantor Kelurahan / Desa & Dinas Sosial Setempat',
  estimatedTime: '1 - 2 hari kerja (tergantung verifikasi lapangan jika diperlukan)',
  fees: {
    isFree: true,
    officialAmount: 0,
    currency: 'IDR',
    description: 'Penerbitan SKTM di Kelurahan/Desa adalah GRATIS (Rp0).',
    legalReference: 'Peraturan Menteri Sosial & Standar Pelayanan Publik Daerah',
  },
  sources: [
    {
      id: 'permensos-dtks',
      title: 'Peraturan Menteri Sosial tentang Pengelolaan Data Terpadu Kesejahteraan Sosial',
      sourceName: 'Kementerian Sosial RI',
      sourceUrl: 'https://kemensos.go.id',
      verifiedAt: '2026-01-15',
      legalBasis: 'Kriteria keluarga rentan dan masyarakat berpenghasilan rendah',
    },
    {
      id: 'sop-sktm-kelurahan',
      title: 'Prosedur Tetap Pelayanan Surat Keterangan Miskin / Tidak Mampu',
      sourceName: 'Pemerintah Daerah',
      verifiedAt: '2026-01-15',
      legalBasis: 'Layanan publik bebas biaya retribusi',
    },
  ],
  questions: [
    {
      id: 'keperluan_sktm',
      title: 'Untuk keperluan apa SKTM ini diajukan?',
      description: 'Menentukan dokumen pendukung spesifik yang harus dilampirkan.',
      options: [
        {
          id: 'pendidikan',
          label: 'Pendidikan (Beasiswa, KIP Kuliah, Keringanan SPP / UKT)',
          value: 'pendidikan',
        },
        {
          id: 'kesehatan',
          label: 'Kesehatan (Keringanan Biaya Rumah Sakit, Pengajuan BPJS PBI)',
          value: 'kesehatan',
        },
        {
          id: 'umum',
          label: 'Bantuan Sosial / Keperluan Administrasi Umum Lainnya',
          value: 'umum',
        },
      ],
      defaultValue: 'pendidikan',
    },
  ],
  baseRequirementIds: [
    'ktp_pemohon_sktm',
    'kk_pemohon_sktm',
    'pengantar_rt_rw_sktm',
    'pernyataan_tidak_mampu_materai',
  ],
  allRequirements: [
    {
      id: 'ktp_pemohon_sktm',
      title: 'Fotokopi KTP-el Pemohon / Kepala Keluarga',
      description: 'Salinan KTP yang masih berlaku untuk verifikasi identitas kependudukan.',
      isMandatory: true,
    },
    {
      id: 'kk_pemohon_sktm',
      title: 'Fotokopi Kartu Keluarga (KK)',
      description: 'Salinan Kartu Keluarga yang memuat data anggota keluarga bersangkutan.',
      isMandatory: true,
    },
    {
      id: 'pengantar_rt_rw_sktm',
      title: 'Surat Pengantar RT/RW yang Menyatakan Tidak Mampu',
      description: 'Surat keterangan dari pengurus RT dan RW lingkungan tempat tinggal pemohon.',
      isMandatory: true,
      notes: 'Pengurus RT/RW mengetahui kondisi ekonomi warganya secara langsung di lapangan.',
    },
    {
      id: 'pernyataan_tidak_mampu_materai',
      title: 'Surat Pernyataan Tidak Mampu Bermaterai Rp10.000',
      description: 'Surat pernyataan yang ditandatangani kepala keluarga menyatakan kebenaran kondisi ekonomi.',
      isMandatory: true,
      notes: 'Format pernyataan biasanya tersedia di kelurahan atau dibuat mandiri.',
      templateAvailable: true,
      templateId: 'pernyataan-tidak-mampu',
    },
    {
      id: 'rekomendasi_sekolah_kampus',
      title: 'Surat Keterangan / Kartu Pelajar / Mahasiswa',
      description: 'Bukti siswa/mahasiswa aktif dari sekolah atau kampus tujuan beasiswa.',
      isMandatory: false,
      notes: 'Wajib untuk keperluan KIP Kuliah atau keringanan biaya SPP/UKT.',
    },
    {
      id: 'surat_keterangan_rawat_rs',
      title: 'Surat Rujukan Puskesmas / Tagihan Biaya Rumah Sakit',
      description: 'Kuitansi rincian biaya atau surat keterangan rawat inap dari fasilitas kesehatan.',
      isMandatory: false,
      notes: 'Dibutuhkan oleh kelurahan dan Dinas Sosial untuk verifikasi jaminan kesehatan daerah.',
    },
  ],
  rules: [
    {
      id: 'rule_sktm_pendidikan',
      questionId: 'keperluan_sktm',
      operator: 'equals',
      value: 'pendidikan',
      requirementIds: ['rekomendasi_sekolah_kampus'],
    },
    {
      id: 'rule_sktm_kesehatan',
      questionId: 'keperluan_sktm',
      operator: 'equals',
      value: 'kesehatan',
      requirementIds: ['surat_keterangan_rawat_rs'],
    },
  ],
  pitfalls: [
    {
      id: 'sktm-tanda-tangan-materai',
      title: 'Tanda Tangan Harus Menyeberang Materai',
      description: 'Pada surat pernyataan tidak mampu mandiri bermaterai Rp10.000, tanda tangan pemohon wajib mengenai sebagian permukaan materai dan sebagian kertas. Jangan menandatangani hanya di bagian kertas kosong di luar materai.',
      type: 'warning',
    },
    {
      id: 'sktm-tujuan-spesifik',
      title: 'Tujuan Pengajuan Harus Spesifik',
      description: 'Format SKTM diterbitkan sesuai tujuan spesifik (misal: "Untuk Persyaratan KIP Kuliah" atau "Untuk Keringanan Biaya Rumah Sakit"). SKTM tidak dapat dibuat berlaku umum tanpa tujuan jelas.',
      type: 'caution',
    },
    {
      id: 'sktm-survei-lingkungan',
      title: 'Verifikasi Kondisi Riil oleh RT/RW',
      description: 'Ketua RT dan RW berhak menolak memberikan pengantar jika pemohon secara kasat mata dinilai mampu secara finansial. Kejujuran data ekonomi sangat diutamakan.',
      type: 'info',
    },
  ],
  faqs: [
    {
      id: 'faq-sktm-1',
      question: 'Berapa lama masa berlaku selembar SKTM?',
      answer: 'SKTM umumnya hanya berlaku untuk satu kali keperluan pengajuan yang diajukan, atau berumur maksimal 3 sampai 6 bulan sejak tanggal diterbitkan oleh kelurahan.',
    },
    {
      id: 'faq-sktm-2',
      question: 'Apakah harus terdaftar di DTKS (Data Terpadu Kesejahteraan Sosial) Kemensos?',
      answer: 'Untuk pengajuan beasiswa KIP Kuliah atau BPJS PBI, prioritas utama diberikan kepada keluarga yang sudah masuk dalam DTKS. Namun bagi yang belum masuk DTKS, kelurahan tetap dapat menerbitkan SKTM berdasarkan verifikasi riil kondisi ekonomi warga saat ini.',
    },
    {
      id: 'faq-sktm-3',
      question: 'Apakah pengurusan SKTM di Kelurahan dipungut biaya?',
      answer: 'Gratis Rp0. Tidak ada biaya retribusi apapun di kelurahan. Pemohon hanya menyiapkan materai fisik Rp10.000 mandiri untuk lembar surat pernyataan.',
    },
  ],
};
