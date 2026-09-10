# CekLayanan

> **Sudah lengkap sebelum berangkat.**

CekLayanan adalah web application yang membantu masyarakat mengetahui persyaratan administrasi publik berdasarkan kondisi mereka sebelum datang ke kantor pelayanan.

---

## Problem

Masyarakat sering harus datang kembali ke kantor pelayanan karena dokumen yang dibawa tidak lengkap atau tidak sesuai dengan kondisi pengajuan.

CekLayanan membantu mengurangi masalah tersebut dengan memberikan checklist yang lebih personal berdasarkan jawaban pengguna.

---

## Core Concept

```text
Pilih layanan
      ↓
Jawab pertanyaan
      ↓
Rule Engine
      ↓
Persyaratan yang relevan
      ↓
Checklist
      ↓
Siap mengurus
```

---

## MVP Services

- KTP
- KK
- Akta Kelahiran
- Akta Kematian
- Pindah Domisili
- SKU (Surat Keterangan Usaha)
- SKTM (Surat Keterangan Tidak Mampu)
- Surat Ahli Waris

---

## Main Features

### Conditional Checklist
Persyaratan disesuaikan berdasarkan kondisi pengguna.

### Interactive Checklist
Pengguna dapat mencentang dokumen yang sudah disiapkan.

### Printable Checklist
Checklist dapat dicetak atau disimpan sebagai PDF.

### Document Template Generator
Membantu membuat template dokumen yang memang tersedia untuk dibuat secara mandiri.

### Fee Transparency
Menampilkan informasi biaya berdasarkan sumber yang terverifikasi.

---

## Technology

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- PDF-Lib

---

## Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Type Check:

```bash
npx tsc --noEmit
```

---

## Important Disclaimer

CekLayanan merupakan alat bantu persiapan administrasi.

Informasi administratif dapat berubah dan keputusan akhir mengenai penerimaan dokumen tetap berada pada instansi yang berwenang.

Informasi yang ditampilkan sebagai informasi resmi harus memiliki sumber yang dapat diverifikasi.

---

## Product Principle

> **Useful first. Impressive second.**

CekLayanan tidak dibuat untuk memiliki fitur sebanyak mungkin.

CekLayanan dibuat untuk membantu seseorang datang ke kantor pelayanan dengan persiapan yang lebih baik.
