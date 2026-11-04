import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CekLayanan — Panduan Persyaratan Administrasi Publik Mandiri",
  description:
    "Cek dan persiapkan dokumen persyaratan administrasi kependudukan, pencatatan sipil, dan pelayanan kelurahan sesuai kondisi Anda sebelum berangkat ke kantor pelayanan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
